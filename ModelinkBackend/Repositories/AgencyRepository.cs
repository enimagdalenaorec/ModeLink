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

        public async Task<IEnumerable<Agency>> SearchAgenciesAsync(string name, string city, string country)
        {
            // collect agencies
            var query = _context.Agencies
                .Include(a => a.City).ThenInclude(c => c.Country)
                .AsQueryable();

            // filter by name if provided
            if (!string.IsNullOrWhiteSpace(name))
            {
                var searchTerms = name.ToLower().Split(' '); // split name into words
                query = query.Where(a => searchTerms.Any(term => a.Name.ToLower().Contains(term)));
            }

            // filter by city and country together if both are provided
            if (!string.IsNullOrWhiteSpace(city) && !string.IsNullOrWhiteSpace(country))
            {
                query = query.Where(a => a.City.Name.ToLower() == city.ToLower() &&
                                         a.City.Country.Name.ToLower() == country.ToLower());
            }
            // filter by city only if provided and country is not
            else if (!string.IsNullOrWhiteSpace(city))
            {
                query = query.Where(a => a.City.Name.ToLower() == city.ToLower());
            }
            // filter by country only if provided and city is not
            else if (!string.IsNullOrWhiteSpace(country))
            {
                query = query.Where(a => a.City.Country.Name.ToLower() == country.ToLower());
            }

            // execute the query and return the results
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Agency>> GetAgencySuggestionsAsync()
        {
            return await _context.Agencies
                .Include(a => a.City).ThenInclude(c => c.Country)
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
                .ToListAsync();
        }

        public async Task<IEnumerable<Model>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyId)
        {
            return await _context.Models
                .Where(m => (m.AgencyId != agencyId && m.AgencyId == null))
                .Include(m => m.City).ThenInclude(c => c.Country)
                .Include(m => m.Agency)
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

            // Sign the model to the agency
            var model = request.Model;
            model.AgencyId = request.AgencyId;
            _context.Models.Update(model);

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

            // Remove the model from the agency's models list
            var agency = await _context.Agencies
                .Include(a => a.Models)
                .FirstOrDefaultAsync(a => a.Id == model.AgencyId);
            if (agency != null)
            {
                agency.Models.Remove(model);
                _context.Agencies.Update(agency);
            }

            // Remove the model from the agency's events (remove their applications)
            var events = await _context.Events
                .Where(e => e.AgencyId == model.AgencyId)
                .Include(e => e.ModelApplications)
                .ToListAsync();
            foreach (var ev in events)
            {
                var application = ev.ModelApplications.FirstOrDefault(ma => ma.ModelId == model.Id);
                if (application != null)
                {
                    ev.ModelApplications.Remove(application);
                    _context.Events.Update(ev);
                }
            }

            model.AgencyId = null; // unsign the model
            model.Agency = null; // clear the agency reference
            _context.Models.Update(model);

            await _context.SaveChangesAsync();

            return model;
        }

        public async Task<Agency> GetAgencyByAgencyIdAsync(int agencyId)
        {
            return await _context.Agencies
                .Where(a => a.Id == agencyId)
                .Include(a => a.User)
                .Include(a => a.City).ThenInclude(c => c.Country)
                .Include(a => a.Models)
                .Include(a => a.Events)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAgencyAsync(Agency agency)
        {
            _context.Entry(agency).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Agency>> GetAgenciesForAdminCrudAsync()
        {
            return await _context.Agencies
                .Include(a => a.User)
                .Include(a => a.City).ThenInclude(c => c.Country)
                .Include(a => a.Models).ThenInclude(m => m.User)
                .Include(a => a.Events)
                .ToListAsync();
        }

        public async Task<Agency> GetAgencyByUserIdAsync(int userId)
        {
            return await _context.Agencies
                .Where(a => a.UserId == userId)
                .Include(a => a.User)
                .Include(a => a.City).ThenInclude(c => c.Country)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAgencyAsync(Agency agency)
        {
            _context.Agencies.Remove(agency);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
