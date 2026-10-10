using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class ResetPasswordDto
{
    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}
