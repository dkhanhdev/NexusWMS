using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IReceivingRepository
{
    Task<List<Receiving>> GetAllAsync();
    Task<PagedResult<ReceivingDto>> GetPagedAsync(ReceivingListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<Receiving?> GetByIdAsync(Guid id);
    Task<Receiving?> GetConfirmedByPurchaseOrderIdAsync(Guid purchaseOrderId);
    Task<ReceivingDetail?> GetDetailByIdAsync(Guid id);
    Task AddAsync(Receiving receiving);
    Task UpdateAsync(Receiving receiving);
    Task RemoveDetailsAsync(Guid receivingId);
    Task DeleteAsync(Receiving receiving);
}
