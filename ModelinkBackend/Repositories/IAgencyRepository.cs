using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IAgencyRepository
    {
        Task<IEnumerable<Agency>> SearchAgenciesAsync(string name, string city, string country);
        Task<IEnumerable<Agency>> GetAgencySuggestionsAsync();
        Task<IEnumerable<Model>> GetModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<Model>> GetOutsideSignedModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<Model>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyUserId);
        Task<IEnumerable<Event>> GetActiveEventsByAgencyIdAsync(int agencyId);
        Task<Agency> GetAgencyInfoAsync(int userId);
        Task<FreelancerRequest> AcceptFreelancerRequestAsync(int requestId);
        Task<FreelancerRequest> DeclineFreelancerRequestAsync(int requestId);
        Task<Model> UnsignModelAsync(int userId);
        Task<Agency> GetAgencyByAgencyIdAsync(int agencyId);
        Task<bool> UpdateAgencyAsync(Agency agency);
        Task<IEnumerable<Agency>> GetAgenciesForAdminCrudAsync();
        Task<Agency> GetAgencyByUserIdAsync(int userId);
        Task<bool> DeleteAgencyAsync(Agency agency);
    }
}
