using Microsoft.EntityFrameworkCore;
using NexusWMS.Domain.Entities;
using NexusWMS.Domain.Enums;
using NexusWMS.UnitTests.Common;

namespace NexusWMS.UnitTests.InboundOutbound;

public class RmaLifecycleTests
{
    [Fact]
    public async Task Rma_ShouldTransitionThroughAllStatesCorrectly()
    {
        var dbName = Guid.NewGuid().ToString();
        var tenantId = Guid.NewGuid();
        var rmaId = Guid.NewGuid();
        var saleOrderId = Guid.NewGuid();
        var productId = Guid.NewGuid();

        // 1. Arrange & Create RMA as Requested
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var category = new Category { Id = Guid.NewGuid(), Name = "Elec", TenantId = tenantId };
            var product = new Product { Id = productId, Sku = "SKU-RMA", Name = "Headphones", CategoryId = category.Id, TenantId = tenantId };
            var order = new SaleOrder { Id = saleOrderId, OrderNo = "SO-RMA-01", Status = SaleOrderStatus.Shipped, TenantId = tenantId };

            db.Categories.Add(category);
            db.Products.Add(product);
            db.SaleOrders.Add(order);

            var rma = new Rma
            {
                Id = rmaId,
                SaleOrderId = saleOrderId,
                Reason = "Khách hàng đổi trả do không thích màu",
                Status = RmaStatus.Requested,
                TenantId = tenantId,
                RmaDetails = new List<RmaDetail>
                {
                    new RmaDetail
                    {
                        Id = Guid.NewGuid(),
                        ProductId = productId,
                        Quantity = 1,
                        Condition = ProductCondition.Ok,
                        Disposition = Disposition.Restock,
                        TenantId = tenantId,
                    }
                }
            };
            db.Rmas.Add(rma);
            await db.SaveChangesAsync();
        }

        // 2. Requested -> Approved
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var rma = await db.Rmas.FindAsync(rmaId);
            Assert.NotNull(rma);
            Assert.Equal(RmaStatus.Requested, rma.Status);

            rma.Status = RmaStatus.Approved;
            await db.SaveChangesAsync();
        }

        // 3. Approved -> Received
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var rma = await db.Rmas.FindAsync(rmaId);
            Assert.NotNull(rma);
            Assert.Equal(RmaStatus.Approved, rma.Status);

            rma.Status = RmaStatus.Received;
            await db.SaveChangesAsync();
        }

        // 4. Received -> Inspected
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var rma = await db.Rmas.Include(r => r.RmaDetails).FirstOrDefaultAsync(r => r.Id == rmaId);
            Assert.NotNull(rma);
            Assert.Equal(RmaStatus.Received, rma.Status);

            var detail = rma.RmaDetails.First();
            detail.Condition = ProductCondition.Ok;
            detail.Disposition = Disposition.Restock;

            rma.Status = RmaStatus.Inspected;
            await db.SaveChangesAsync();
        }

        // 5. Inspected -> Completed
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var rma = await db.Rmas.FindAsync(rmaId);
            Assert.NotNull(rma);
            Assert.Equal(RmaStatus.Inspected, rma.Status);

            rma.Status = RmaStatus.Completed;
            await db.SaveChangesAsync();
        }

        // Verify final state
        using (var db = TestDbContextFactory.Create(tenantId, dbName))
        {
            var rma = await db.Rmas.FindAsync(rmaId);
            Assert.NotNull(rma);
            Assert.Equal(RmaStatus.Completed, rma.Status);
        }
    }
}
