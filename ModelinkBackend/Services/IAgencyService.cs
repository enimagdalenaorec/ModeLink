using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Services
{
    public interface IAgencyService
    {
        Task<IEnumerable<AgencySearchDto>> SearchAgenciesAsync(string name, string city, string country);
        Task<IEnumerable<AgencySuggestionDto>> GetAgencySuggestionsAsync();
        Task<IEnumerable<ModelSuggestionDto>> GetModelsByAgencyIdAsync(int agencyId);
        Task<IEnumerable<ModelSuggestionDto>> GetOutsideSignedModelsByAgencyIdAsync(int agencyId);
        Task<IEnumerable<ModelSuggestionDto>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyId);
        Task<IEnumerable<EventCardDTO>> GetActiveEventsByAgencyIdAsync(int agencyId);
        Task<AgencyInfoDto> GetAgencyInfoAsync(int userId);
        Task<bool> AcceptFreelancerRequestAsync(int requestId);
        Task<bool> DeclineFreelancerRequestAsync(int requestId);
        Task<bool> UnsignModelAsync(int userId);
        Task<bool> UpdateAgencyInfoAsync(UpdateAgencyInfoDTO updateAgencyInfoDto);
    }
}
