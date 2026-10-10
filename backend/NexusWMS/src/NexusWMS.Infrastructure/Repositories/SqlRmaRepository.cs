using Microsoft.EntityFrameworkCore;
using NexusWMS.Application.Interfaces;
using NexusWMS.Domain.Entities;
using NexusWMS.Infrastructure.Data;

namespace NexusWMS.Infrastructure.Repositories;

public class SqlRmaRepository : IRmaRepository
{
    private readonly WmsDbContext _db;

    public SqlRmaRepository(WmsDbContext db)
    {
        _db = db;
    }

    public async Task<List<Rma>> GetAllAsync()
    {
        return await _db.Rmas
            .Include(r => r.SaleOrder)
                .ThenInclude(s => s.Warehouse)
            .Include(r => r.RmaDetails)
                .ThenInclude(d => d.Product)
            .OrderByDescending(r => r.CreatedDate)
            .ToListAsync();
    }

    public async Task<Rma?> GetByIdAsync(Guid id)
    {
        return await _db.Rmas
            .Include(r => r.SaleOrder)
                .ThenInclude(s => s.Warehouse)
            .Include(r => r.RmaDetails)
                .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Rma?> GetBySaleOrderIdAsync(Guid saleOrderId)
    {
        return await _db.Rmas
            .Include(r => r.SaleOrder)
                .ThenInclude(s => s.Warehouse)
            .Include(r => r.RmaDetails)
                .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(r => r.SaleOrderId == saleOrderId);
    }

    public async Task AddAsync(Rma rma)
    {
        await _db.Rmas.AddAsync(rma);
    }

    public Task UpdateAsync(Rma rma)
    {
        _db.Rmas.Update(rma);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Rma rma)
    {
        _db.RmaDetails.RemoveRange(rma.RmaDetails);
        _db.Rmas.Remove(rma);
        return Task.CompletedTask;
    }
}
