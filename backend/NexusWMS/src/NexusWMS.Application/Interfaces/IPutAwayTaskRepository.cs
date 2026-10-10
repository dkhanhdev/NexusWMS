using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IPutAwayTaskRepository
{
    Task<List<PutAwayTask>> GetAllAsync(Guid? assignToId = null);
    Task<PagedResult<PutAwayTaskDto>> GetPagedAsync(PutAwayTaskListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<PutAwayTask?> GetByIdAsync(Guid id);
    Task AddAsync(PutAwayTask putAwayTask);
    Task UpdateAsync(PutAwayTask putAwayTask);
    Task DeleteAsync(PutAwayTask putAwayTask);
    Task<int> GetIncompleteCountByPurchaseOrderAsync(Guid purchaseOrderId);
    Task<int> GetTotalQuantityByReceivingDetailAsync(Guid receivingDetailId, Guid? excludeTaskId = null);
}
