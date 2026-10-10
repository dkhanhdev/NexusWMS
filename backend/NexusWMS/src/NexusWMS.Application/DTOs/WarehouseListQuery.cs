namespace NexusWMS.Application.DTOs;

public class WarehouseListQuery
{
    public int Page { get; init; } = 1;
    public string? Search { get; init; }
}
