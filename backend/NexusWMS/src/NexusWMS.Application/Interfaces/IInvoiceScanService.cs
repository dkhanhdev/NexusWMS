using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IInvoiceScanService
{
    Task<InvoiceScanResultDto> ScanAsync(
        Guid purchaseOrderId,
        Stream imageStream,
        string fileName,
        CancellationToken cancellationToken = default);
}
