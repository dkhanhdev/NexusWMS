using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Domain.Entities;

public class StockMovement : BaseAuditableEntity
{
    public Guid ProductId { get; set; }

    [Required]
    public Product Product { get; set; } = null!;

    public Guid LocationId { get; set; }

    [Required]
    public Location Location { get; set; } = null!;

    public MovementType MovementType { get; set; }
    public int Qty { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}
