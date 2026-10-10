using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IRmaService
{
    Task<List<RmaDto>> GetAllAsync();
    Task<RmaDto?> GetByIdAsync(Guid id);
    Task<RmaDto> CreateAsync(CreateRmaDto dto);
    Task<RmaDto?> ApproveAsync(Guid id);
    Task<RmaDto?> ReceiveAsync(Guid id);
    Task<RmaDto?> InspectAsync(Guid id, InspectRmaDto dto);
    Task<RmaDto?> CompleteAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}
