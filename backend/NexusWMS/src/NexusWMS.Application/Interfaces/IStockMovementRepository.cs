using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IStockMovementRepository
{
    Task<List<StockMovement>> GetAllAsync();
    Task<StockMovement?> GetByIdAsync(Guid id);
    Task<PagedResult<StockMovementDto>> GetPagedAsync(StockMovementQueryDto query, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(StockMovement stockMovement);
    Task UpdateAsync(StockMovement stockMovement);
    Task DeleteAsync(StockMovement stockMovement);
}
