using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IStockAdjustmentService
{
    Task<List<StockAdjustmentDto>> GetAllAsync();
    Task<StockAdjustmentDto?> GetByIdAsync(Guid id);
    Task<StockAdjustmentDto> CreateAsync(CreateStockAdjustmentDto dto);
    Task<StockAdjustmentDto?> ApproveAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}
