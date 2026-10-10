using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;

namespace NexusWMS.Infrastructure.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _repository;

    public AuditLogService(IAuditLogRepository repository)
    {
        _repository = repository;
    }

    public Task<PagedResult<AuditLogDto>> GetPagedAsync(AuditLogQueryDto query, int pageSize, CancellationToken cancellationToken = default)
        => _repository.GetPagedAsync(query, pageSize, cancellationToken);

    public Task<List<StatusHistoryDto>> GetStatusHistoryAsync(string entityType, Guid entityId)
        => _repository.GetStatusHistoryAsync(entityType, entityId);

    public Task<PagedResult<StatusHistoryDto>> GetStatusHistoriesPagedAsync(StatusHistoryQueryDto query, int pageSize, CancellationToken cancellationToken = default)
        => _repository.GetStatusHistoriesPagedAsync(query, pageSize, cancellationToken);
}
