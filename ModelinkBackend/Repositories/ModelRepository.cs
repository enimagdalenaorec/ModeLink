using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Data;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public class ModelRepository : IModelRepository
    {
        private readonly ApplicationDbContext _context;

        public ModelRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Model>> SearchModelsAsync(string query)
        {
            var searchTerms = query.ToLower().Split(' '); // Split query into words
            return await _context.Models
                .Where(m => searchTerms.Any(term => m.FirstName.ToLower().Contains(term) || m.LastName.ToLower().Contains(term)))
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetModelSuggestionsAsync()
        {
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Take(7) // limit to 7
                .ToListAsync();
        }

        public async Task<Model> GetModelByIdAsync(int modelId)
        {
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .FirstOrDefaultAsync(m => m.UserId == modelId);
        }

        public async Task<ModelStatusHistory> GetLatestModelStatus(int modelId)
        {
            return await _context.ModelStatusHistories
                .Where(m => m.ModelId == modelId)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }

    }
}
