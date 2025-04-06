using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IAgencyRepository
    {
        Task<IEnumerable<Agency>> SearchAgenciesAsync(string query);
        Task<IEnumerable<Agency>> GetAgencySuggestionsAsync();
    }
}
