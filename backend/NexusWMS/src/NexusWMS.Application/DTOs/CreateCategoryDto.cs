using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
