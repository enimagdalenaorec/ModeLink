﻿using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Services
{
    public interface IAgencyService
    {
        Task<IEnumerable<AgencySearchDto>> SearchAgenciesAsync(string name, string city, string country);
        Task<IEnumerable<AgencySuggestionDto>> GetAgencySuggestionsAsync();
        Task<IEnumerable<ModelSuggestionDto>> GetModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<ModelSuggestionDto>> GetOutsideSignedModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<ModelSuggestionDto>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<EventCardDTO>> GetActiveEventsByAgencyIdAsync(int agencyId);
        Task<AgencyInfoDto> GetAgencyInfoAsync(int userId);
        Task<bool> AcceptFreelancerRequestAsync(int requestId);
        Task<bool> DeclineFreelancerRequestAsync(int requestId);
        Task<bool> UnsignModelAsync(int userId);
        Task<bool> UpdateAgencyInfoAsync(UpdateAgencyInfoDTO updateAgencyInfoDto);
        Task<IEnumerable<AgenciesForAdminCrudDTO>> GetAgenciesForAdminCrudAsync();
        Task<bool> AdminUpdateAgencyAsync(AgenciesForAdminCrudDTO agencyDto);
        Task<bool> AdminDeleteAgencyAsync(int userId);
        Task<bool> AdminCreateAgencyAsync(RegisterAgencyDto agencyDto);
    }
}
