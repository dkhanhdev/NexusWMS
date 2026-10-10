using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Common;

namespace NexusWMS.Domain.Entities;

public class Category : BaseAuditableEntity
{
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
