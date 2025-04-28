using ModelinkBackend.Models.DTOs;

namespace ModelinkBackend.Services
{
    public interface IEventService
    {
        Task<EventDetailsDTO?> GetEventDetails(int eventId, int userId);
        Task<EventDetailsDTO?> UpdateEvent(UpdateEventDTO updateEventDTO);
    }
}
