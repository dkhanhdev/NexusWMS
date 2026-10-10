using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.DTOs;

public class CreateReceivingDto
{
    [Required]
    public Guid PurchaseOrderId { get; set; }

    [Required]
    [MinLength(1)]
    public List<CreateReceivingDetailDto> Details { get; set; } = new();

    [MaxLength(500)]
    public string? Notes { get; set; }

    [MaxLength(1000)]
    public string? InvoiceImageUrl { get; set; }
}
