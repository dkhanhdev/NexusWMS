using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class CreateStockAdjustmentDetailDto
{
    [Required]
    public Guid ProductId { get; set; }

    [Required]
    public Guid LocationId { get; set; }

    [Range(0, int.MaxValue)]
    public int CountedQty { get; set; }
}
