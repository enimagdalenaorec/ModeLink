using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Services
{
    public interface IAgencyService
    {
        Task<IEnumerable<AgencySearchDto>> SearchAgenciesAsync(string query);
        Task<IEnumerable<AgencySuggestionDto>> GetAgencySuggestionsAsync();
    }
}
