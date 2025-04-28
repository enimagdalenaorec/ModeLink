using ModelinkBackend.Data;
using ModelinkBackend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Models.Entities;


namespace ModelinkBackend.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;
        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Event?> GetEventDetailsAsync(int eventId)
        {
            return await _context.Events
                .Where(e => e.Id == eventId)
                .Include(e => e.Agency)
                .Include(e => e.ModelApplications)
                    .ThenInclude(ma => ma.Model)
                .Include(e => e.City).ThenInclude(c => c.Country)
                .FirstOrDefaultAsync();

        }

        public async Task<Event?> GetEventByIdAsync(int eventId)
        {
            return await _context.Events
                .Where(e => e.Id == eventId)
                .Include(e => e.Agency)
                .Include(e => e.ModelApplications)
                    .ThenInclude(ma => ma.Model)
                .Include(e => e.City).ThenInclude(c => c.Country)
                .FirstOrDefaultAsync();
        }

        public async Task<City?> GetCityByNameAsync(string cityName)
        {
            return await _context.Cities
                .Where(c => c.Name == cityName)
                .Include(c => c.Country)
                .FirstOrDefaultAsync();
        }

        public async Task<Event> UpdateEventAsync(Event eventToUpdate)
        {
            _context.Entry(eventToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return eventToUpdate;
        }

        public async Task<Country?> GetCountryByNameAsync(string countryName)
        {
            return await _context.Countries
                .Where(c => c.Name == countryName)
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

        public async Task DeleteEventAsync(Event eventToDelete)
        {
            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();
        }
    }
}
