using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class CompletePickingDto
{
    [Required]
    [MinLength(1)]
    public List<CompletePickingDetailDto> Details { get; set; } = new();
}
