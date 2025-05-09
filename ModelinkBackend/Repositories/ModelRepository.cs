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

        public async Task<Model> GetModelByIdAsync(int userId)
        {
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Include(m => m.User)
                .Include(m => m.ModelApplications).ThenInclude(ma => ma.Event)
                .FirstOrDefaultAsync(m => m.UserId == userId);
        }

        public async Task<ModelStatusHistory> GetLatestModelStatus(int userId)
        {
            return await _context.ModelStatusHistories
                .Where(m => m.Model.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsModelAttendingEventAsync(int eventId, int modelId)
        {
            return await _context.ModelApplications
                .AnyAsync(em => em.EventId == eventId && em.ModelId == modelId);
        }

        public async Task<bool> RemoveModelFromEventAsync(int eventId, int modelId)
        {
            var modelApplication = await _context.ModelApplications
                .FirstOrDefaultAsync(em => em.EventId == eventId && em.ModelId == modelId);

            if (modelApplication != null)
            {
                _context.ModelApplications.Remove(modelApplication);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> AddModelToEventAsync(int eventId, int modelId)
        {
            var modelApplication = new ModelApplication
            {
                EventId = eventId,
                ModelId = modelId,
                Status = "Attending"
            };

            await _context.ModelApplications.AddAsync(modelApplication);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PortfolioPost>> GetPortfolioPostsAsync(int modelId)
        {
            return await _context.PortfolioPosts
                .Where(p => p.ModelId == modelId)
                .Include(p => p.PortfolioImages)
                .ToListAsync();
        }

        public async Task<bool> UpdateModelInfoAsync(Model model)
        {
            //_context.Models.Update(model);
            _context.Entry(model).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Country?> GetCountryByNameAsync(string countryName)
        {
            return await _context.Countries
                .Where(c => c.Name == countryName)
                .FirstOrDefaultAsync();
        }

        public async Task<City?> GetCityByNameAsync(string cityName)
        {
            return await _context.Cities
                .Where(c => c.Name == cityName)
                .Include(c => c.Country)
                .FirstOrDefaultAsync();
        }

        public async Task CreateCountryAsync(Country country)
        {
            await _context.Countries.AddAsync(country);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCityAsync(City city)
        {
            await _context.Cities.AddAsync(city);
            await _context.SaveChangesAsync();
        }
    }
}
