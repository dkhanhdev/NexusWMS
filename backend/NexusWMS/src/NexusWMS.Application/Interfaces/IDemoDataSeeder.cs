using NexusWMS.Application.DTOs;

namespace NexusWMS.Application.Interfaces;

/// Hợp đồng seed dữ liệu demo: chạy idempotent (chạy lại không duplicate),
/// được gate bằng Seed:Enabled. Gọi 1 lần sau Migrate trong Development.
public interface IDemoDataSeeder
{
    Task<SeedSummary> SeedAsync(CancellationToken cancellationToken = default);
}