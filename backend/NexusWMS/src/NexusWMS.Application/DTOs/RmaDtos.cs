using System.ComponentModel.DataAnnotations;
using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.DTOs;

public class RmaDto
{
    public Guid Id { get; set; }
    public string RmaCode => $"RMA-{Id.ToString("N")[..8].ToUpperInvariant()}";
    public Guid SaleOrderId { get; set; }
    public string? SaleOrderNo { get; set; }
    public string? CustomerName { get; set; }
    public Guid? WarehouseId { get; set; }
    public string? WarehouseName { get; set; }
    public string? Reason { get; set; }
    public RmaStatus Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public List<RmaDetailDto> Details { get; set; } = new();
}

public class RmaDetailDto
{
    public Guid Id { get; set; }
    public Guid RmaId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductSku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public ProductCondition Condition { get; set; }
    public Disposition Disposition { get; set; }
}

public class CreateRmaDto
{
    [Required]
    public Guid SaleOrderId { get; set; }

    [MaxLength(500)]
    public string? Reason { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Phiếu đổi trả phải có ít nhất một sản phẩm.")]
    public List<CreateRmaDetailDto> Details { get; set; } = new();
}

public class CreateRmaDetailDto
{
    [Required]
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0.")]
    public int Quantity { get; set; }

    public ProductCondition Condition { get; set; } = ProductCondition.Ok;
    public Disposition Disposition { get; set; } = Disposition.Restock;
}

public class InspectRmaDto
{
    [Required]
    public List<InspectRmaItemDto> Details { get; set; } = new();
}

public class InspectRmaItemDto
{
    [Required]
    public Guid DetailId { get; set; }

    public ProductCondition Condition { get; set; }
    public Disposition Disposition { get; set; }
}
