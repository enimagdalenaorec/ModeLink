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
                AgencyName = m.Agency?.Name, // if null, return null
                CityName = m.City?.Name, // if null, return null
                CountryName = m.City?.Country?.Name, // if null, return null
                ProfilePicture = m.ProfilePictureBase64
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetModelSuggestionsAsync()
        {
            var models = await _modelRepository.GetModelSuggestionsAsync();

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                AgencyName = m.Agency?.Name, // if null, return null
                CityName = m.City?.Name, // if null, return null
                CountryName = m.City?.Country?.Name // if null, return null
            });
        }

        public async Task<ModelStatusAndAgencyIdDTO> GetModelStatusAndAgencyIdAsync(int userId)
        {   
            // get model by user id (does not contain status property)
            var model = await _modelRepository.GetModelByIdAsync(userId);
            if (model == null)
            {
                return null;
            }

            // get latest row for model id in the ModelStatusHistories table
            var modelStatus = await _modelRepository.GetLatestModelStatus(userId);

            return new ModelStatusAndAgencyIdDTO
            {
                Status = modelStatus.Status,
                AgencyId = model.Agency?.Id // nullable if the model is freelance
            };
        }

        public async Task<bool> ToggleEventAttendanceAsync(int eventId, int modelId)
        {
            // is model already attending the event
            var isAttending = await _modelRepository.IsModelAttendingEventAsync(eventId, modelId);

            if (isAttending)
            {
                // if attending, remove the attendance
                return await _modelRepository.RemoveModelFromEventAsync(eventId, modelId);
            }
            else
            {
                // ff not, add the attendance
                return await _modelRepository.AddModelToEventAsync(eventId, modelId);
            }
        }
    }
}
