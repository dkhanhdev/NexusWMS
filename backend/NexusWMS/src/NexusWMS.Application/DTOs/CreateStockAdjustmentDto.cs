using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class CreateStockAdjustmentDto
{
    [MaxLength(500)]
    public string? Notes { get; set; }

    [Required]
    [MinLength(1)]
    public List<CreateStockAdjustmentDetailDto> Details { get; set; } = new();
}