using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IStockMovementService
{
    Task<PagedResult<StockMovementDto>> GetPagedAsync(StockMovementQueryDto query, int pageSize, CancellationToken cancellationToken = default);
}
