using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;

namespace NexusWMS.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class RmasController : ControllerBase
{
    private readonly IRmaService _service;

    public RmasController(IRmaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _service.GetAllAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var rma = await _service.GetByIdAsync(id);
        if (rma == null) return NotFound(new { message = "Không tìm thấy phiếu đổi trả." });
        return Ok(rma);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,WarehouseManager")]
    public async Task<IActionResult> Create([FromBody] CreateRmaDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin,WarehouseManager")]
    public async Task<IActionResult> Approve([FromRoute] Guid id)
    {
        var result = await _service.ApproveAsync(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy phiếu đổi trả." });
        return Ok(result);
    }

    [HttpPost("{id}/receive")]
    [Authorize(Roles = "Admin,WarehouseManager,WarehouseStaff")]
    public async Task<IActionResult> Receive([FromRoute] Guid id)
    {
        var result = await _service.ReceiveAsync(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy phiếu đổi trả." });
        return Ok(result);
    }

    [HttpPost("{id}/inspect")]
    [Authorize(Roles = "Admin,WarehouseManager,WarehouseStaff")]
    public async Task<IActionResult> Inspect([FromRoute] Guid id, [FromBody] InspectRmaDto dto)
    {
        var result = await _service.InspectAsync(id, dto);
        if (result == null) return NotFound(new { message = "Không tìm thấy phiếu đổi trả." });
        return Ok(result);
    }

    [HttpPost("{id}/complete")]
    [Authorize(Roles = "Admin,WarehouseManager")]
    public async Task<IActionResult> Complete([FromRoute] Guid id)
    {
        var result = await _service.CompleteAsync(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy phiếu đổi trả." });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound(new { message = "Không tìm thấy phiếu đổi trả hoặc phiếu không ở trạng thái 'Yêu cầu'." });
        return NoContent();
    }
}
