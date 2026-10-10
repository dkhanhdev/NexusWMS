using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.Interfaces;

public interface IWarehouseService
{
    Task<List<WarehouseDto>> GetAllAsync();
    Task<PagedResult<WarehouseDto>> GetPagedAsync(WarehouseListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<WarehouseDto?> GetByIdAsync(Guid id);
    Task<WarehouseDto> CreateAsync(CreateWarehouseDto dto);
    Task<WarehouseDto?> UpdateAsync(Guid id, UpdateWarehouseDto dto);
    Task<DeleteWarehouseResult> DeleteAsync(Guid id);
}
