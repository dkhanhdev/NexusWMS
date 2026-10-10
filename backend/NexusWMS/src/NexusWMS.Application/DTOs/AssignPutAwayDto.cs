using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class AssignPutAwayDto
{
    [Required]
    public Guid UserId { get; set; }
}