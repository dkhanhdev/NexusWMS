using System.ComponentModel.DataAnnotations;

namespace NexusWMS.Application.DTOs;

public class CreatePickingDto
{
    [Required]
    public Guid SaleOrderId { get; set; }

    [Required]
    public Guid WarehouseId { get; set; }
}
