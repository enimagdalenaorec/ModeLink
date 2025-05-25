using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Data;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public class AgencyRepository : IAgencyRepository
    {
        private readonly ApplicationDbContext _context;

        public AgencyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Agency>> SearchAgenciesAsync(string query)
        {
            var searchTerms = query.ToLower().Split(' '); // Split query into words
            return await _context.Agencies
                .Where(a => searchTerms.Any(term => a.Name.ToLower().Contains(term)))
                .Include(a => a.City).ThenInclude(c => c.Country)
                .ToListAsync();
        }

        public async Task<IEnumerable<Agency>> GetAgencySuggestionsAsync()
        {
            return await _context.Agencies
                .Include(a => a.City).ThenInclude(c => c.Country)
                .Take(7) // limit to 7
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetModelsByAgencyIdAsync(int agencyId)
        {
            return await _context.Models
                .Where(m => m.AgencyId == agencyId)
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetOutsideSignedModelsByAgencyIdAsync(int agencyId)
        {
            return await _context.Models
                .Where(m => ( m.AgencyId != agencyId && m.AgencyId != null) )
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Take(7) // limit to 7
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyId)
        {
            return await _context.Models
                .Where(m => (m.AgencyId != agencyId && m.AgencyId == null))
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
                .Take(7) // limit to 7
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetActiveEventsByAgencyIdAsync(int agencyId)
        {
            return await _context.Events
                .Where(e => e.AgencyId == agencyId && e.EventStart > DateTime.UtcNow)
                .Include(e => e.City).ThenInclude(c => c.Country)
                .Include(e => e.Agency)
                .ToListAsync();
        }

        public async Task<Agency> GetAgencyInfoAsync(int userId)
        {
            return await _context.Agencies
                .Where(a => a.UserId == userId)
                .Include(a => a.User)
                .Include(a => a.City).ThenInclude(c => c.Country)
                .Include(a => a.Models).ThenInclude(e => e.City).ThenInclude(c => c.Country)
                .Include(a => a.Events).ThenInclude(e => e.City).ThenInclude(c => c.Country)
                .Include(a => a.FreelancerRequests).ThenInclude(fr => fr.Model).ThenInclude(m => m.City).ThenInclude(c => c.Country)
                .FirstOrDefaultAsync();
        }

        public async Task<FreelancerRequest> AcceptFreelancerRequestAsync(int requestId)
        {
            var request = await _context.FreelancerRequests
                .Include(fr => fr.Model)
                .FirstOrDefaultAsync(fr => fr.Id == requestId);

            if (request == null)
            {
                return null; 
            }

            request.Status = "accepted";
            _context.FreelancerRequests.Update(request);
            await _context.SaveChangesAsync();

            return request;
        }

        public async Task<FreelancerRequest> DeclineFreelancerRequestAsync(int requestId)
        {
            var request = await _context.FreelancerRequests
                .Include(fr => fr.Model)
                .FirstOrDefaultAsync(fr => fr.Id == requestId);

            if (request == null)
            {
                return null;
            }

            request.Status = "declined";
            _context.FreelancerRequests.Update(request);
            await _context.SaveChangesAsync();

            return request;
        }

        public async Task<Model> UnsignModelAsync(int userId)
        {
            var model = await _context.Models
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (model == null)
            {
                return null; // Model not found
            }

            model.AgencyId = null; // unsign the model
            _context.Models.Update(model);
            await _context.SaveChangesAsync();

            return model;
        }

    }
}
