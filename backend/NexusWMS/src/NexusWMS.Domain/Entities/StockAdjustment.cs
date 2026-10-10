using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Domain.Entities;

public class StockAdjustment : BaseAuditableEntity
{
    [MaxLength(50)]
    public string AdjustmentNo { get; set; } = string.Empty;

    public StockAdjustmentStatus Status { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }

    public Guid? ApprovedById { get; set; }
    public User? ApprovedBy { get; set; }
    public DateTime? ApprovedDate { get; set; }

    public ICollection<StockAdjustmentDetail> Details { get; set; } = new List<StockAdjustmentDetail>();
}