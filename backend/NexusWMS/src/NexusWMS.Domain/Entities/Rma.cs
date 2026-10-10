using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Domain.Entities;

public class Rma : BaseAuditableEntity
{
    public Guid SaleOrderId { get; set; }

    [Required]
    public SaleOrder SaleOrder { get; set; } = null!;

    [MaxLength(500)]
    public string? Reason { get; set; }

    public RmaStatus Status { get; set; }

    public ICollection<RmaDetail> RmaDetails { get; set; } = new List<RmaDetail>();
}
