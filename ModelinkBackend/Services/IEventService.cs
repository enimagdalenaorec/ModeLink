using ModelinkBackend.Models.DTOs;

namespace ModelinkBackend.Services
{
    public interface IEventService
    {
        Task<EventDetailsDTO?> GetEventDetailsAsync(int eventId, int userId);
        Task<EventDetailsDTO?> UpdateEventAsync(UpdateEventDTO updateEventDTO);
        Task<EventDetailsDTO?> DeleteEventAsync(int eventId);
        Task<bool?> AddEventAsync(AddNewEventDTO addNewEventDTO);
    }
}
