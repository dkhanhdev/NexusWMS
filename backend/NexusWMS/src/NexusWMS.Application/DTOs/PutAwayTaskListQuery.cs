using NexusWMS.Domain.Enums;

namespace NexusWMS.Application.DTOs;

public class PutAwayTaskListQuery
{
    public int Page { get; init; } = 1;
    public Guid? AssignToId { get; init; }
    public PutAwayTaskStatus? Status { get; init; }
}
