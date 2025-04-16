using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IEventRepository
    {
        Task<Event?> GetEventDetails(int eventId);
    }
}
