using AutoMapper;
using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;
using NexusWMS.Domain.Entities;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Infrastructure.Services;

public class RmaService : IRmaService
{
    private readonly IRmaRepository _rmaRepo;
    private readonly ISaleOrderRepository _saleOrderRepo;
    private readonly IStockRepository _stockRepo;
    private readonly ILocationRepository _locationRepo;
    private readonly IStockMovementRepository _movementRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RmaService(
        IRmaRepository rmaRepo,
        ISaleOrderRepository saleOrderRepo,
        IStockRepository stockRepo,
        ILocationRepository locationRepo,
        IStockMovementRepository movementRepo,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _rmaRepo = rmaRepo;
        _saleOrderRepo = saleOrderRepo;
        _stockRepo = stockRepo;
        _locationRepo = locationRepo;
        _movementRepo = movementRepo;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<RmaDto>> GetAllAsync()
    {
        var list = await _rmaRepo.GetAllAsync();
        return _mapper.Map<List<RmaDto>>(list);
    }

    public async Task<RmaDto?> GetByIdAsync(Guid id)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return null;
        return _mapper.Map<RmaDto>(rma);
    }

    public async Task<RmaDto> CreateAsync(CreateRmaDto dto)
    {
        var saleOrder = await _saleOrderRepo.GetByIdAsync(dto.SaleOrderId)
            ?? throw new InvalidOperationException("Không tìm thấy đơn bán hàng.");

        if (saleOrder.Status != SaleOrderStatus.Shipped && saleOrder.Status != SaleOrderStatus.Packed)
        {
            throw new InvalidOperationException(
                $"Chỉ có thể tạo phiếu đổi/trả cho đơn bán đã đóng gói hoặc đã giao hàng (trạng thái hiện tại: {saleOrder.Status}).");
        }

        var rma = new Rma
        {
            SaleOrderId = dto.SaleOrderId,
            Reason = dto.Reason,
            Status = RmaStatus.Requested,
            CreatedDate = DateTime.UtcNow,
        };

        foreach (var d in dto.Details)
        {
            var sod = saleOrder.SaleOrderDetails.FirstOrDefault(x => x.ProductId == d.ProductId);
            if (sod == null)
            {
                throw new InvalidOperationException($"Sản phẩm với ID '{d.ProductId}' không thuộc đơn bán này.");
            }

            if (d.Quantity > sod.Quantity)
            {
                throw new InvalidOperationException(
                    $"Số lượng đổi trả ({d.Quantity}) vượt quá số lượng đặt mua ban đầu ({sod.Quantity}).");
            }

            rma.RmaDetails.Add(new RmaDetail
            {
                ProductId = d.ProductId,
                Quantity = d.Quantity,
                Condition = d.Condition,
                Disposition = d.Disposition,
                CreatedDate = DateTime.UtcNow,
            });
        }

        await _rmaRepo.AddAsync(rma);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(rma.Id))!;
    }

    public async Task<RmaDto?> ApproveAsync(Guid id)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return null;

        if (rma.Status != RmaStatus.Requested)
        {
            throw new InvalidOperationException(
                $"Không thể duyệt phiếu đổi trả ở trạng thái '{rma.Status}'. Phiếu phải ở trạng thái 'Yêu cầu' (Requested).");
        }

        rma.Status = RmaStatus.Approved;
        rma.UpdatedDate = DateTime.UtcNow;
        await _rmaRepo.UpdateAsync(rma);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(rma.Id))!;
    }

    public async Task<RmaDto?> ReceiveAsync(Guid id)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return null;

        if (rma.Status != RmaStatus.Approved)
        {
            throw new InvalidOperationException(
                $"Không thể nhận hàng trả cho phiếu ở trạng thái '{rma.Status}'. Phiếu phải ở trạng thái 'Đã duyệt' (Approved).");
        }

        rma.Status = RmaStatus.Received;
        rma.UpdatedDate = DateTime.UtcNow;
        await _rmaRepo.UpdateAsync(rma);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(rma.Id))!;
    }

    public async Task<RmaDto?> InspectAsync(Guid id, InspectRmaDto dto)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return null;

        if (rma.Status != RmaStatus.Received && rma.Status != RmaStatus.Inspected)
        {
            throw new InvalidOperationException(
                $"Không thể kiểm tra sản phẩm cho phiếu ở trạng thái '{rma.Status}'. Phiếu phải ở trạng thái 'Đã nhận' (Received).");
        }

        var map = dto.Details.ToDictionary(x => x.DetailId);
        foreach (var detail in rma.RmaDetails)
        {
            if (map.TryGetValue(detail.Id, out var item))
            {
                detail.Condition = item.Condition;
                detail.Disposition = item.Disposition;
                detail.UpdatedDate = DateTime.UtcNow;
            }
        }

        rma.Status = RmaStatus.Inspected;
        rma.UpdatedDate = DateTime.UtcNow;
        await _rmaRepo.UpdateAsync(rma);
        await _unitOfWork.SaveChangesAsync();

        return (await GetByIdAsync(rma.Id))!;
    }

    public async Task<RmaDto?> CompleteAsync(Guid id)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return null;

        if (rma.Status != RmaStatus.Inspected)
        {
            throw new InvalidOperationException(
                $"Không thể hoàn tất phiếu ở trạng thái '{rma.Status}'. Phiếu phải ở trạng thái 'Đã kiểm tra' (Inspected).");
        }

        await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var warehouseId = rma.SaleOrder.WarehouseId;
            var locations = warehouseId.HasValue
                ? await _locationRepo.GetByWarehouseIdAsync(warehouseId.Value)
                : new List<Location>();

            foreach (var detail in rma.RmaDetails)
            {
                // Chỉ hoàn kho những mặt hàng đạt tiêu chuẩn Restock và tình trạng Ok
                if (detail.Disposition == Disposition.Restock && detail.Condition == ProductCondition.Ok)
                {
                    Location? targetLocation = null;
                    if (warehouseId.HasValue)
                    {
                        // Tìm vị trí Storage còn sức chứa
                        targetLocation = locations.FirstOrDefault(l =>
                            l.LocationType == LocationType.Storage &&
                            l.CurrentQuantity + detail.Quantity <= l.MaxQuantity)
                            ?? locations.FirstOrDefault(l => l.LocationType == LocationType.Storage);
                    }

                    if (targetLocation != null)
                    {
                        var stock = await _stockRepo.GetByProductAndLocationAsync(detail.ProductId, targetLocation.Id);
                        if (stock == null)
                        {
                            stock = new Stock
                            {
                                ProductId = detail.ProductId,
                                LocationId = targetLocation.Id,
                                OnhandQty = detail.Quantity,
                                ReservedQty = 0,
                                CreatedDate = DateTime.UtcNow,
                            };
                            await _stockRepo.AddAsync(stock);
                        }
                        else
                        {
                            stock.OnhandQty += detail.Quantity;
                            await _stockRepo.UpdateAsync(stock);
                        }

                        targetLocation.CurrentQuantity += detail.Quantity;
                        await _locationRepo.UpdateAsync(targetLocation);

                        await _movementRepo.AddAsync(new StockMovement
                        {
                            ProductId = detail.ProductId,
                            LocationId = targetLocation.Id,
                            MovementType = MovementType.In,
                            Qty = detail.Quantity,
                            Notes = $"RMA Restock - Mã đơn: {rma.SaleOrder.OrderNo}, Phiếu RMA: {rma.Id:N}[..8]",
                            CreatedDate = DateTime.UtcNow,
                        });
                    }
                }
            }

            rma.Status = RmaStatus.Completed;
            rma.UpdatedDate = DateTime.UtcNow;
            await _rmaRepo.UpdateAsync(rma);
            await _unitOfWork.SaveChangesAsync();
        });

        return (await GetByIdAsync(rma.Id))!;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var rma = await _rmaRepo.GetByIdAsync(id);
        if (rma == null) return false;

        if (rma.Status != RmaStatus.Requested)
        {
            throw new InvalidOperationException(
                $"Chỉ có thể xóa phiếu đổi trả ở trạng thái 'Yêu cầu' (Requested).");
        }

        await _rmaRepo.DeleteAsync(rma);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
