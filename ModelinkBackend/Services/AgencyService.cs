using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Repositories;

namespace ModelinkBackend.Services
{
    public class AgencyService : IAgencyService
    {
        private readonly IAgencyRepository _agencyRepository;

        public AgencyService(IAgencyRepository agencyRepository)
        {
            _agencyRepository = agencyRepository;
        }

        public async Task<IEnumerable<AgencySearchDto>> SearchAgenciesAsync(string query)
        {
            var agencies = await _agencyRepository.SearchAgenciesAsync(query);

            return agencies.Select(a => new AgencySearchDto
            {
                UserId = a.UserId,
                Name = a.Name,
                CityName = a.City?.Name, // If null, return null
                CountryName = a.City?.Country?.Name, // If null, return null
                ProfilePicture = a.ProfilePictureBase64
            });
        }

        public async  Task<IEnumerable<AgencySuggestionDto>> GetAgencySuggestionsAsync()
        {
            var agencies = await _agencyRepository.GetAgencySuggestionsAsync();

            return agencies.Select(a => new AgencySuggestionDto
            {
                UserId = a.UserId,
                Name = a.Name,
                ProfilePicture = a.ProfilePictureBase64,
                CityName = a.City?.Name, // If null, return null
                CountryName = a.City?.Country?.Name // If null, return null
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name, 
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetOutsideSignedModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetOutsideSignedModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name,
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetOutsideFreelanceModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name, // should always be null
            });
        }

        public async Task<IEnumerable<EventCardDTO>> GetActiveEventsByAgencyIdAsync(int agencyId)
        {
            var events = await _agencyRepository.GetActiveEventsByAgencyIdAsync(agencyId);

            return events.Select(e => new EventCardDTO
            {
                Id = e.Id,
                Title = e.Title,
                AgencyName = e.Agency?.Name,
                CityName = e.City?.Name, // If null, return null
                CountryName = e.City?.Country?.Name, // If null, return null
                StartDate = e.EventStart.ToString("dd-MM"),
                ProfilePicture = e.ProfilePictureBase64
            });
        }

    }
}
