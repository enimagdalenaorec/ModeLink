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

        public async Task<IEnumerable<Model>> SearchModelsAsync(string name, string city, string country)
        {
            // collect models
            var query = _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .AsQueryable();

            // filter by name if provided
            if (!string.IsNullOrWhiteSpace(name))
            {
                var searchTerms = name.ToLower().Split(' '); // split name into words
                query = query.Where(m => searchTerms.Any(term =>
                    m.FirstName.ToLower().Contains(term) ||
                    m.LastName.ToLower().Contains(term)));
            }

            // filter by city and country together if both are provided
            if (!string.IsNullOrWhiteSpace(city) && !string.IsNullOrWhiteSpace(country))
            {
                query = query.Where(m => m.City.Name.ToLower() == city.ToLower() &&
                                         m.City.Country.Name.ToLower() == country.ToLower());
            }
            // filter by city only if provided and country is not
            else if (!string.IsNullOrWhiteSpace(city))
            {
                query = query.Where(m => m.City.Name.ToLower() == city.ToLower());
            }
            // filter by country only if provided and city is not
            else if (!string.IsNullOrWhiteSpace(country))
            {
                query = query.Where(m => m.City.Country.Name.ToLower() == country.ToLower());
            }

            // execute the query and return the results
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetModelSuggestionsAsync()
        {
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
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

        public async Task<Model> GetModelByModelIdAsync(int modelId)
        {
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Include(m => m.User)
                .Include(m => m.ModelApplications).ThenInclude(ma => ma.Event)
                .FirstOrDefaultAsync(m => m.Id == modelId);
        }

        public async Task<ModelStatusHistory> GetLatestModelStatus(int userId)
        {
            return await _context.ModelStatusHistories
                .Where(m => m.Model.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsModelAttendingEventAsync(int eventId, int userModelId)
        {
            return await _context.ModelApplications
                .AnyAsync(em => em.EventId == eventId && em.Model.UserId == userModelId);
        }

        public async Task<bool> RemoveModelFromEventAsync(int eventId, int userModelId)
        {
            var modelApplication = await _context.ModelApplications
                .FirstOrDefaultAsync(em => em.EventId == eventId && em.Model.UserId == userModelId);

            if (modelApplication != null)
            {
                _context.ModelApplications.Remove(modelApplication);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> AddModelToEventAsync(int eventId, int userModelId)
        {
            // get model bi userid of the model
            var model = await _context.Models
                .FirstOrDefaultAsync(m => m.UserId == userModelId);
            var modelApplication = new ModelApplication
            {
                EventId = eventId,
                ModelId = model.Id,
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

        public async Task<PortfolioPost> GetPortfolioPostByIdAsync(int postId)
        {
            return await _context.PortfolioPosts
                .Include(p => p.PortfolioImages)
                .Include(p => p.Model)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<bool> UpdatePortfolioPostAsync(PortfolioPost portfolioPost)
        {
            _context.Entry(portfolioPost).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePortfolioPostAsync(PortfolioPost portfolioPost)
        {
            _context.PortfolioPosts.Remove(portfolioPost);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreatePortfolioPostAsync(PortfolioPost postWithoutImages)
        {
            await _context.PortfolioPosts.AddAsync(postWithoutImages);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddPortfolioImageToPostAsync(PortfolioImage portfolioImage)
        {
            await _context.PortfolioImages.AddAsync(portfolioImage);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FreelancerRequest>> GetFreelancerRequestsAsync(int modelId)
        {
            return await _context.FreelancerRequests
                .Where(fr => fr.ModelId == modelId)
                .Include(fr => fr.Agency)
                .Include(fr => fr.Agency.City).ThenInclude(c => c.Country)
                .ToListAsync();
        }

        public async Task<FreelancerRequest> CreateFreelancerRequestAsync(FreelancerRequest request)
        {
            await _context.FreelancerRequests.AddAsync(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<FreelancerRequest> GetFreelancerRequestAsync(int agencyId, int modelId)
        {
            return await _context.FreelancerRequests
                .FirstOrDefaultAsync(fr => fr.AgencyId == agencyId && fr.ModelId == modelId);
        }

        public async Task<bool> DeleteFreelancerRequestAsync(FreelancerRequest request)
        {
            _context.FreelancerRequests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Model>> GetModelsForAdminCrudAsync()
        {
            //return await _context.Models
            //    .Include(m => m.User)
            //    .Include(m => m.City).ThenInclude(c => c.Country)
            //    .Include(m => m.Agency)
            //    .Include(m => m.ModelApplications).ThenInclude(ma => ma.Event)
            //    .Include(m => m.FreelancerRequests).ThenInclude(fr => fr.Agency)
            //    .Include(m => m.PortfolioPosts)
            //    .ToListAsync();
            return await _context.Models
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Include(m => m.User)
                .Include(m => m.ModelApplications).ThenInclude(ma => ma.Event)
                .Include(m => m.PortfolioPosts)
                .Include(m => m.FreelancerRequests).ThenInclude(fr => fr.Agency)
                .ToListAsync();
        }
    }
}
