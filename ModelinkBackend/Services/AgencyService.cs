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
                StartDate = e.EventStart.ToString("dd-MM-yyyy"),
                ProfilePicture = e.ProfilePictureBase64
            });
        }

        public async Task<AgencyInfoDto> GetAgencyInfoAsync(int userId)
        {
            var agency = await _agencyRepository.GetAgencyInfoAsync(userId);

            if (agency == null)
            {
                return null;
            }

            List<EventCardDTO> events = agency.Events
                .Select(e => new EventCardDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    AgencyName = agency.Name,
                    CityName = e.City?.Name, // If null, return null
                    CountryName = e.City?.Country?.Name, // If null, return null
                    StartDate = e.EventStart.ToString("dd-MM-yyyy"),
                    ProfilePicture = e.ProfilePictureBase64
                }).ToList();

            List<FreelancerRequestForAgency> freelancerRequests = agency.FreelancerRequests
                .Select(fr => new FreelancerRequestForAgency
                {
                    RequestId = fr.Id,
                    UserModelId = fr.Model.UserId,
                    ModelId = fr.ModelId,
                    ModelFirstName = fr.Model.FirstName,
                    ModelLastName = fr.Model.LastName,
                    ModelCityName = fr.Model.City?.Name, // ff null, return null
                    ModelCountryName = fr.Model.City?.Country?.Name, // if null, return null
                    ModelProfilePicture = fr.Model.ProfilePictureBase64,
                    Status = fr.Status.ToString(),
                    RequestedAt = fr.RequestedAt
                }).ToList();

            List<ModelSuggestionDto> models = agency.Models
                .Select(m => new ModelSuggestionDto
                {
                    UserId = m.UserId,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    ProfilePicture = m.ProfilePictureBase64,
                    CityName = m.City?.Name, // If null, return null
                    CountryName = m.City?.Country?.Name, // If null, return null
                    AgencyName = agency.Name,
                }).ToList();

            return new AgencyInfoDto
            {
                UserId = agency.UserId,
                AgencyId = agency.Id,
                Name = agency.Name,
                Email = agency.User.Email,
                Description = agency.Description,
                Address = agency.Address,
                ProfilePicture = agency.ProfilePictureBase64,
                CityName = agency.City?.Name, 
                CountryName = agency.City?.Country?.Name, 
                CountryCode = agency.City?.Country?.Code, 
                Models = models, // could be empty
                Events = events,   // could be empty
                FreelancerRequests = freelancerRequests   // could be empty
            };
        }

        public async Task<bool> AcceptFreelancerRequestAsync(int requestId)
        {
            FreelancerRequest req = await _agencyRepository.AcceptFreelancerRequestAsync(requestId);
            if (req == null)
            {
                return false; // request not found or could not be accepted
            }
            return true;
        }

        public async Task<bool> DeclineFreelancerRequestAsync(int requestId)
        {
            FreelancerRequest req = await _agencyRepository.DeclineFreelancerRequestAsync(requestId);
            if (req == null)
            {
                return false; // request not found or could not be declined
            }
            return true;
        }

        public async Task<bool> UnsignModelAsync(int userId)
        {
            Model model = await _agencyRepository.UnsignModelAsync(userId);
            if (model == null)
            {
                return false; // model not found or could not be unsigned
            }
            return true; // model successfully unsigned
        }

        public async Task<bool> UpdateAgencyInfoAsync(UpdateAgencyInfoDTO updateAgencyInfoDTO)
        {
            if (updateAgencyInfoDTO == null || updateAgencyInfoDTO.AgencyId <= 0)
            {
                return false; // invalid input
            }

            Agency agency = await _agencyRepository.GetAgencyByAgencyIdAsync(updateAgencyInfoDTO.AgencyId);
            if (agency == null)
            {
                return false; // agency not found
            }

            agency.Name = updateAgencyInfoDTO.Name;
            agency.User.Email = updateAgencyInfoDTO.Email;
            agency.Description = updateAgencyInfoDTO.Description;
            agency.City.Name = updateAgencyInfoDTO.CityName;
            agency.City.Country.Name = updateAgencyInfoDTO.CountryName;
            agency.City.Country.Code = updateAgencyInfoDTO.CountryCode;
            agency.Address = updateAgencyInfoDTO.Address;
            agency.ProfilePictureBase64 = updateAgencyInfoDTO.ProfilePicture;

            return await _agencyRepository.UpdateAgencyAsync(agency);
        }

    }
}
