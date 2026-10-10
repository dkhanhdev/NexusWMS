using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task RegisterAsync(RegisterDto dto);
}
