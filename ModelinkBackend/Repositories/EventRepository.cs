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

        public async Task<Event?> GetEventDetails(int eventId)
        {
            return await _context.Events
                .Where(e => e.Id == eventId)
                .Include(e => e.Agency)
                .Include(e => e.ModelApplications)
                    .ThenInclude(ma => ma.Model)
                .Include(e => e.City).ThenInclude(c => c.Country)
                .FirstOrDefaultAsync();

        }
    }
}
