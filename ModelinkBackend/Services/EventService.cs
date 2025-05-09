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

        public async Task<EventDetailsDTO?> GetEventDetailsAsync(int eventId, int userId)
        {
            var eventDetails = await _eventRepository.GetEventDetailsAsync(eventId);
            if(eventDetails == null)
            {
                return null;
            }

            EventDetailsDTO eventDetailsDTO = new EventDetailsDTO
            {
                Id = eventDetails.Id,
                Title = eventDetails.Title,
                Description = eventDetails.Description,
                Address = eventDetails.Address,
                CityName = eventDetails.City.Name,
                CountryName = eventDetails.City?.Country?.Name,
                CountryCode = eventDetails.City?.Country?.Code,
                Latitude = eventDetails.Latitude,
                Longitude = eventDetails.Longitude,
                EventStart = eventDetails.EventStart,
                EventFinish = eventDetails.EventFinish,
                ProfilePicture = eventDetails.ProfilePictureBase64,
                Status = eventDetails.Status.ToString(),
                AgencyName = eventDetails.Agency.Name,
                ModelApplications = eventDetails.ModelApplications.Select(ma => new ModelApplicationOverviewDTO
                {
                    Id = ma.Model.UserId,
                    FirstName = ma.Model.FirstName,
                    LastName = ma.Model.LastName,
                    ProfilePicture = ma.Model.ProfilePictureBase64
                }).ToList(),
                isAttending = eventDetails.ModelApplications.Any(ma => ma.ModelId == userId)
            };
            return eventDetailsDTO;
        }

        public async Task<EventDetailsDTO?> UpdateEventAsync(UpdateEventDTO updateEventDTO)
        {
            var eventToUpdate = await _eventRepository.GetEventByIdAsync(updateEventDTO.Id);
            if (eventToUpdate == null)
            {
                return null;
            }

            // check or create country first
            var country = !string.IsNullOrEmpty(updateEventDTO.CountryName)
                ? await _eventRepository.GetCountryByNameAsync(updateEventDTO.CountryName)
                : null;

            if (country == null && !string.IsNullOrEmpty(updateEventDTO.CountryName) && !string.IsNullOrEmpty(updateEventDTO.CountryCode))
            {
                country = new Country
                {
                    Name = updateEventDTO.CountryName,
                    Code = updateEventDTO.CountryCode
                };
                await _eventRepository.CreateCountryAsync(country);
            }

            // check or create city
            var city = !string.IsNullOrEmpty(updateEventDTO.CityName)
                ? await _eventRepository.GetCityByNameAsync(updateEventDTO.CityName)
                : null;

            if (city == null && !string.IsNullOrEmpty(updateEventDTO.CityName) && country != null)
            {
                city = new City
                {
                    Name = updateEventDTO.CityName,
                    CountryId = country.Id
                };
                await _eventRepository.CreateCityAsync(city);
            }

            // update event
            eventToUpdate.Title = updateEventDTO.Title;
            eventToUpdate.Description = updateEventDTO.Description;
            eventToUpdate.Address = updateEventDTO.Address;
            eventToUpdate.CityId = city.Id;
            eventToUpdate.Latitude = updateEventDTO.Latitude;
            eventToUpdate.Longitude = updateEventDTO.Longitude;
            eventToUpdate.EventStart = updateEventDTO.EventStart;
            eventToUpdate.EventFinish = updateEventDTO.EventFinish;
            eventToUpdate.ProfilePictureBase64 = updateEventDTO.ProfilePicture;
            eventToUpdate.Status = updateEventDTO.Status;

            await _eventRepository.UpdateEventAsync(eventToUpdate);

            return new EventDetailsDTO
            {
                Id = eventToUpdate.Id,
                Title = eventToUpdate.Title,
                Description = eventToUpdate.Description,
                Address = eventToUpdate.Address,
                CityName = eventToUpdate.City?.Name,
                CountryName = eventToUpdate.City?.Country?.Name,
                CountryCode = eventToUpdate.City?.Country?.Code,
                Latitude = eventToUpdate.Latitude,
                Longitude = eventToUpdate.Longitude,
                EventStart = eventToUpdate.EventStart,
                EventFinish = eventToUpdate.EventFinish,
                ProfilePicture = eventToUpdate.ProfilePictureBase64,
                Status = eventToUpdate.Status.ToString(),
                AgencyName = eventToUpdate.Agency?.Name
            };
        }

        public async Task<EventDetailsDTO?> DeleteEventAsync(int eventId)
        {
            var eventToDelete = await _eventRepository.GetEventByIdAsync(eventId);
            if (eventToDelete == null)
            {
                return null;
            }

            await _eventRepository.DeleteEventAsync(eventToDelete);

            return new EventDetailsDTO
            {
                Id = eventToDelete.Id,
                Title = eventToDelete.Title,
                Description = eventToDelete.Description,
                Address = eventToDelete.Address,
                CityName = eventToDelete.City?.Name,
                CountryName = eventToDelete.City?.Country?.Name,
                CountryCode = eventToDelete.City?.Country?.Code,
                Latitude = eventToDelete.Latitude,
                Longitude = eventToDelete.Longitude,
                EventStart = eventToDelete.EventStart,
                EventFinish = eventToDelete.EventFinish,
                ProfilePicture = eventToDelete.ProfilePictureBase64,
                Status = eventToDelete.Status.ToString(),
                AgencyName = eventToDelete.Agency?.Name
            };
        }
    }
}
