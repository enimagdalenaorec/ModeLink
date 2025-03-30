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

    }
}
