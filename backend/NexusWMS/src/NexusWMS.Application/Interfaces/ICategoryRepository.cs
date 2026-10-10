using NexusWMS.Application.DTOs;
using NexusWMS.Domain.Entities;

namespace NexusWMS.Application.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<PagedResult<CategoryDto>> GetPagedAsync(CategoryListQuery query, int pageSize, CancellationToken cancellationToken = default);
    Task<Category?> GetByIdAsync(Guid id);
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Category category);
    Task<bool> HasProductsAsync(Guid categoryId);
}
