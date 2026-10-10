using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.DTOs;

public class CreateReceivingDetailDto
{
    [Required]
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int ExpectedQuantity { get; set; }

    [Range(1, int.MaxValue)]
    public int ActualQuantity { get; set; }

    public ProductCondition Condition { get; set; } = ProductCondition.Ok;

    [MaxLength(50)]
    public string? LotNumber { get; set; }

    public DateTime? ExpiryDate { get; set; }
}
