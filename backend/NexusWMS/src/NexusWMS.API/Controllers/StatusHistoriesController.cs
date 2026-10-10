using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NexusWMS.API.Configuration;
using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;

namespace NexusWMS.API.Controllers;

[ApiController]
[Authorize(Roles = "Admin,WarehouseManager")]
[Route("api/status-histories")]
public class StatusHistoriesController : ControllerBase
{
    private readonly IAuditLogService _service;
    private readonly PaginationOptions _paginationOptions;

    public StatusHistoriesController(IAuditLogService service, IOptions<PaginationOptions> paginationOptions)
    {
        _service = service;
        _paginationOptions = paginationOptions.Value;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] StatusHistoryQueryDto query, CancellationToken cancellationToken)
    {
        if (query.Page < 1)
            return BadRequest(new { message = "Page must be greater than or equal to 1." });

        var result = await _service.GetStatusHistoriesPagedAsync(query, _paginationOptions.PageSize, cancellationToken);
        return Ok(result);
    }
}
