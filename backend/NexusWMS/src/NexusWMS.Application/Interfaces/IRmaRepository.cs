using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IRmaRepository
{
    Task<List<Rma>> GetAllAsync();
    Task<Rma?> GetByIdAsync(Guid id);
    Task<Rma?> GetBySaleOrderIdAsync(Guid saleOrderId);
    Task AddAsync(Rma rma);
    Task UpdateAsync(Rma rma);
    Task DeleteAsync(Rma rma);
}
