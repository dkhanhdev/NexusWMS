using Microsoft.EntityFrameworkCore;
using NexusWMS.Application.Interfaces;
using NexusWMS.Domain.Entities;
using NexusWMS.Infrastructure.Data;

namespace NexusWMS.Infrastructure.Repositories;

public class SqlShipmentRepository : IShipmentRepository
{
    private readonly WmsDbContext _db;

    public SqlShipmentRepository(WmsDbContext db)
    {
        _db = db;
    }

    public async Task<List<Shipment>> GetAllAsync()
    {
        return await _db.Shipments
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.Warehouse)
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.SaleOrderDetails)
                    .ThenInclude(d => d.Product)
            .OrderByDescending(s => s.CreatedDate)
            .ToListAsync();
    }

    public async Task<Shipment?> GetByIdAsync(Guid id)
    {
        return await _db.Shipments
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.Warehouse)
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.SaleOrderDetails)
                    .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Shipment?> GetBySaleOrderIdAsync(Guid saleOrderId)
    {
        return await _db.Shipments
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.Warehouse)
            .Include(s => s.SaleOrder)
                .ThenInclude(o => o.SaleOrderDetails)
                    .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(s => s.SaleOrderId == saleOrderId);
    }

    public async Task AddAsync(Shipment shipment)
    {
        await _db.Shipments.AddAsync(shipment);
    }

    public Task UpdateAsync(Shipment shipment)
    {
        _db.Shipments.Update(shipment);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Shipment shipment)
    {
        _db.Shipments.Remove(shipment);
        return Task.CompletedTask;
    }
}
