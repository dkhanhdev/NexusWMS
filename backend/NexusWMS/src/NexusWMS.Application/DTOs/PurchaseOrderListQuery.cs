using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.DTOs;

public class PurchaseOrderListQuery
{
    public int Page { get; init; } = 1;
    public string? Search { get; init; }
    public PurchaseOrderStatus? Status { get; init; }
    public Guid? WarehouseId { get; set; }
}
