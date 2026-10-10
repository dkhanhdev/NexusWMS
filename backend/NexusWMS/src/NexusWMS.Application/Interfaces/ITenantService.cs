using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface ITenantService
{
    Task RegisterTenantAsync(RegisterTenantDto dto, string? clientOrigin = null);
    Task VerifyEmailAsync(VerifyEmailDto dto);
}
