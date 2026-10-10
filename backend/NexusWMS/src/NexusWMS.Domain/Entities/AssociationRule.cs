using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;

namespace NexusWMS.Domain.Entities;

public class AssociationRule : BaseAuditableEntity
{
    [MaxLength(500)]
    public string Antecedent { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Consequent { get; set; } = string.Empty;

    public double Confidence { get; set; }
    public double Lift { get; set; }
}
