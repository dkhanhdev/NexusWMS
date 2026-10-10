using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface IProductMappingService
{
    List<ProductMatchDto> MapLines(
        List<InvoiceLineItemDto> lines,
        List<PurchaseOrderDetail> poDetails,
        List<Product> allProducts);
}
