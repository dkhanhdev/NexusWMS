using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NexusWMS.API.Configuration;
using NexusWMS.Application.DTOs;
using NexusWMS.Application.Interfaces;

namespace NexusWMS.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    private readonly PaginationOptions _paginationOptions;

    public ProductsController(IProductService service, IOptions<PaginationOptions> paginationOptions)
    {
        _service = service;
        _paginationOptions = paginationOptions.Value;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductListQuery query, CancellationToken cancellationToken)
    {
        if (query.Page < 1)
            return BadRequest(new { message = "Page must be greater than or equal to 1." });

        var result = await _service.GetPagedAsync(query, _paginationOptions.PageSize, cancellationToken);
        return Ok(result);
    }

    [HttpGet("lookup")]
    public async Task<IActionResult> Lookup()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound(new { message = "Product not found" });

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateProductRequest request)
    {
        var file = request.File;
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn ảnh sản phẩm." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Ảnh phải nhỏ hơn 5MB." });

        var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest(new { message = "Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF." });

        try
        {
            await using var stream = file.OpenReadStream();
            var result = await _service.CreateAsync(request, stream, file.FileName);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateProductRequest request)
    {
        var file = request.File;
        if (file != null && file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Ảnh phải nhỏ hơn 5MB." });

        if (file != null)
        {
            var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowed.Contains(file.ContentType))
                return BadRequest(new { message = "Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF." });
        }

        try
        {
            await using var stream = file?.OpenReadStream();
            var result = await _service.UpdateAsync(id, request, stream, file?.FileName);
            if (result == null)
                return NotFound(new { message = "Product not found" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return Ok(new { message = "Deleted successfully" });
    }

    [HttpPost("{id}/image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Vui lòng chọn file ảnh." });
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Ảnh phải nhỏ hơn 5MB." });

        var allowed = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
        if (!allowed.Contains(file.ContentType))
            return BadRequest(new { message = "Chỉ nhận ảnh JPG, PNG, WEBP hoặc GIF." });

        try
        {
            await using var stream = file.OpenReadStream();
            var imageUrl = await _service.UploadImageAsync(id, stream, file.FileName);
            if (imageUrl == null) return NotFound(new { message = "Product not found" });
            return Ok(new { imageUrl });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class CreateProductRequest : CreateProductDto
{
    public IFormFile? File { get; set; }
}

public class UpdateProductRequest : UpdateProductDto
{
    public IFormFile? File { get; set; }
}
