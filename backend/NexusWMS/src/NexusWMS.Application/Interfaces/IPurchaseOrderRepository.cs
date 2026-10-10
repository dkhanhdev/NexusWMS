using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IPurchaseOrderRepository
{
    Task<List<PurchaseOrder>> GetAllAsync();
    Task<PagedResult<PurchaseOrderDto>> GetPagedAsync(PurchaseOrderListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<PurchaseOrder?> GetByIdAsync(Guid id);
    Task<bool> ExistsByPoNumberAsync(string poNumber);
    Task AddAsync(PurchaseOrder purchaseOrder);
    Task UpdateAsync(PurchaseOrder purchaseOrder);
    Task DeleteAsync(PurchaseOrder purchaseOrder);
    Task RemoveDetailsAsync(Guid purchaseOrderId);
}
