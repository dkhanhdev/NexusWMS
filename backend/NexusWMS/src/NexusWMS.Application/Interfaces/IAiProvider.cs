using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

public interface IAiProvider
{
    Task<InvoiceExtractionResult> ExtractInvoiceAsync(
        Stream imageStream,
        string fileName,
        CancellationToken cancellationToken = default);
}
