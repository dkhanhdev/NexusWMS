using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;

namespace NexusWMS.Infrastructure.Services;

public class StockMovementService : IStockMovementService
{
    private readonly IStockMovementRepository _repo;

    public StockMovementService(IStockMovementRepository repo)
    {
        _repo = repo;
    }

    public Task<PagedResult<StockMovementDto>> GetPagedAsync(StockMovementQueryDto query, int pageSize, CancellationToken cancellationToken = default)
        => _repo.GetPagedAsync(query, pageSize, cancellationToken);
}
