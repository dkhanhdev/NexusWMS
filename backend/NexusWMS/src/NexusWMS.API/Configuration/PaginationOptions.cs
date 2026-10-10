using System.ComponentModel.DataAnnotations;

namespace NexusWMS.API.Configuration;

public class PaginationOptions
{
    public const string SectionName = "Pagination";

    [Range(1, int.MaxValue)]
    public int PageSize { get; init; } = 10;
}
