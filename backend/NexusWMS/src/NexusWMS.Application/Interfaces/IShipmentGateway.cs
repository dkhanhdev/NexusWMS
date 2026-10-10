using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

/// <summary>
/// Seam cho tích hợp vận chuyển bên thứ ba (GHN, Grab, J&T, ...).
/// Ngoài phạm vi hiện tại — phiên bản demo chỉ ghi log.
/// </summary>
public interface IShipmentGateway
{
    Task NotifyShippedAsync(ShipmentShippedNotification notification, CancellationToken cancellationToken = default);
}