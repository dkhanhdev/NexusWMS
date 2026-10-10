using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;

namespace NexusWMS.Domain.Entities;

public class Warehouse : BaseAuditableEntity
{
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    public ICollection<Location> Locations { get; set; } = new List<Location>();
}
