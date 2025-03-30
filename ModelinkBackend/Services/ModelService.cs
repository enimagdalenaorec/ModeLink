using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Repositories;

namespace ModelinkBackend.Services
{
    public class ModelService : IModelService
    {
        private readonly IModelRepository _modelRepository;

        public ModelService(IModelRepository modelRepository)
        {
            _modelRepository = modelRepository;
        }

        public async Task<IEnumerable<ModelSearchDto>> SearchModelsAsync(string query)
        {
            var models = await _modelRepository.SearchModelsAsync(query);

            return models.Select(m => new ModelSearchDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                AgencyId = m.Agency?.UserId, // if null, return null
                CityName = m.City?.Name, // if null, return null
                CountryName = m.City?.Country?.Name, // if null, return null
                ProfilePicture = m.ProfilePictureBase64
            });
        }
    }
}
