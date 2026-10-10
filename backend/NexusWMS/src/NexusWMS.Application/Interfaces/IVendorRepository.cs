using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IVendorRepository
{
    Task<List<Vendor>> GetAllAsync();
    Task<PagedResult<VendorDto>> GetPagedAsync(VendorListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<Vendor?> GetByIdAsync(Guid id);
    Task<bool> ExistsByNameAsync(string name, Guid? excludeId = null);
    Task AddAsync(Vendor vendor);
    Task UpdateAsync(Vendor vendor);
    Task DeleteAsync(Vendor vendor);
}