using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class AssignPickingDto
{
    [Required]
    public Guid UserId { get; set; }
}
