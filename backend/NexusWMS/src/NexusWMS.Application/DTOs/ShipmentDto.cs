namespace NexusWMS.Application.DTOs;

public class ShipmentDto
{
    public Guid Id { get; set; }
    public Guid SaleOrderId { get; set; }
    public string? SaleOrderNo { get; set; }
    public string? CustomerName { get; set; }
    public string? WarehouseName { get; set; }
    public string? Carrier { get; set; }
    public string? TrackingNo { get; set; }
    public DateTime? ShippedDate { get; set; }
    public DateTime CreatedDate { get; set; }
}
