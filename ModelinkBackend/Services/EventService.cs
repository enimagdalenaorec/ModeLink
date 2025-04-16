using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Repositories;

namespace ModelinkBackend.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<EventDetailsDTO?> GetEventDetails(int eventId, int userId)
        {
            var eventDetails = await _eventRepository.GetEventDetails(eventId);

            EventDetailsDTO eventDetailsDTO = new EventDetailsDTO
            {
                Id = eventDetails.Id,
                Title = eventDetails.Title,
                Description = eventDetails.Description,
                Address = eventDetails.Address,
                CityName = eventDetails.City.Name,
                CountryName = eventDetails.City?.Country?.Name,
                Latitude = eventDetails.Latitude,
                Longitude = eventDetails.Longitude,
                EventStart = eventDetails.EventStart,
                EventFinish = eventDetails.EventFinish,
                ProfilePicture = eventDetails.ProfilePictureBase64,
                Status = eventDetails.Status.ToString(),
                AgencyName = eventDetails.Agency.Name,
                ModelApplications = eventDetails.ModelApplications.Select(ma => new ModelApplicationOverviewDTO
                {
                    Id = ma.Id,
                    FirstName = ma.Model.FirstName,
                    LastName = ma.Model.LastName,
                    ProfilePicture = ma.Model.ProfilePictureBase64
                }).ToList(),
                isAttending = eventDetails.ModelApplications.Any(ma => ma.ModelId == userId)
            };
            return eventDetailsDTO;
        }
    }
}
