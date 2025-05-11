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

        public async Task<ModelInfoDTO> GetModelDetailsAsync(int userId)
        {
            var model = await _modelRepository.GetModelByIdAsync(userId);

            if (model == null)
            {
                return null;
            }

            var modelApplicationsDto = model.ModelApplications.Select(a => new ModelApplicationForCalendarDTO
            {
                ApplicationId = a.Id,
                EventId = a.EventId,
                EventName = a.Event.Title,
                EventStart = a.Event.EventStart,
                EventFinish = (DateTime)a.Event.EventFinish
            }).ToArray();

            var modelInfo = new ModelInfoDTO
            {
                ModelApplications = modelApplicationsDto,
                UserId = model.UserId,
                ModelId = model.Id,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.User.Email,
                AgencyName = model.Agency?.Name,
                AgencyId = model.Agency.UserId,
                CityName = model.City?.Name,
                CountryName = model.City?.Country?.Name,
                CountryCode = model.City?.Country?.Code,
                Height = model.Height,
                Weight = model.Weight,
                EyeColor = model.EyeColor,
                HairColor = model.HairColor,
                SkinColor = model.SkinColor,
                Gender = model.Sex,
                ProfilePicture = model.ProfilePictureBase64
            };

            return modelInfo;
        }

        public async Task<IEnumerable<PortfolioPostDTO>> GetPortfolioAsync(int modelId)
        {
            var portfolioPosts = await _modelRepository.GetPortfolioPostsAsync(modelId);

            if (portfolioPosts == null)
            {
                return null;
            }

            return portfolioPosts.Select(p => new PortfolioPostDTO
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                Images = p.PortfolioImages.Select(i => i.ImageBase64).ToList()
            }).ToList();
        }

        public async Task<bool> UpdateModelInfoAsync(UpdateModelInfoDTO modelInfo)
        {
            if (modelInfo == null)
                throw new ArgumentNullException(nameof(modelInfo));

            // retrieve the model
            var existingModel = await _modelRepository.GetModelByIdAsync(modelInfo.ModelId);
            if (existingModel == null)
            {
                return false;
            }

            // check or create country first
            var country = !string.IsNullOrEmpty(modelInfo.CountryName)
                ? await _modelRepository.GetCountryByNameAsync(modelInfo.CountryName)
                : null;

            if (country == null && !string.IsNullOrEmpty(modelInfo.CountryName) && !string.IsNullOrEmpty(modelInfo.CountryCode))
            {
                country = new Country
                {
                    Name = modelInfo.CountryName,
                    Code = modelInfo.CountryCode
                };
                await _modelRepository.CreateCountryAsync(country);
            }

            // check or create city
            var city = !string.IsNullOrEmpty(modelInfo.CityName)
                ? await _modelRepository.GetCityByNameAsync(modelInfo.CityName)
                : null;

            if (city == null && !string.IsNullOrEmpty(modelInfo.CityName) && country != null)
            {
                city = new City
                {
                    Name = modelInfo.CityName,
                    CountryId = country.Id
                };
                await _modelRepository.CreateCityAsync(city);
            }

            // update the properties 
            existingModel.FirstName = modelInfo.FirstName;
            existingModel.LastName = modelInfo.LastName;
            existingModel.User.Email = modelInfo.Email;
            existingModel.CityId = city.Id;
            existingModel.Height = modelInfo.Height;
            existingModel.Weight = modelInfo.Weight;
            existingModel.EyeColor = modelInfo.EyeColor;
            existingModel.HairColor = modelInfo.HairColor;
            existingModel.SkinColor = modelInfo.SkinColor;
            existingModel.Sex = modelInfo.Gender;
            existingModel.ProfilePictureBase64 = modelInfo.ProfilePicture;


            // update in the repository
            await _modelRepository.UpdateModelInfoAsync(existingModel);

            return true;
        }

        public async Task<bool> UpdateModelPortfolioAsync(int modelId, PortfolioPostDTO portfolioPost)
        {
            if (portfolioPost == null)
                throw new ArgumentNullException(nameof(portfolioPost));

            // retrieve the model
            var existingModel = await _modelRepository.GetModelByIdAsync(modelId);
            if (existingModel == null)
            {
                return false;
            }

            // check or create portfolio post
            var existingPortfolioPost = await _modelRepository.GetPortfolioPostByIdAsync(portfolioPost.Id);

            // check if the model who sent request si the post's owner
            if (existingPortfolioPost == null || existingPortfolioPost.Model.Id != modelId)
            {
                return false;
            }

            // update the properties 
            existingPortfolioPost.Title = portfolioPost.Title;
            existingPortfolioPost.Description = portfolioPost.Description;
            existingPortfolioPost.CreatedAt = portfolioPost.CreatedAt;
            existingPortfolioPost.PortfolioImages = portfolioPost.Images
                .Select(image => new PortfolioImage
                {
                    ImageBase64 = image,
                    PostId = existingPortfolioPost.Id
                }).ToList();

            // update in the repository
            await _modelRepository.UpdatePortfolioPostAsync(existingPortfolioPost);

            return true;
        }

        public async Task<bool> DeleteModelPortfolioPostAsync(int modelId, int postId)
        {
            // retrieve the model
            var existingModel = await _modelRepository.GetModelByIdAsync(modelId);
            if (existingModel == null)
            {
                return false;
            }

            // check if the model who sent request is the post's owner
            var existingPortfolioPost = await _modelRepository.GetPortfolioPostByIdAsync(postId);
            if (existingPortfolioPost == null || existingPortfolioPost.Model.Id != modelId)
            {
                return false;
            }

            // delete in the repository
            return await _modelRepository.DeletePortfolioPostAsync(existingPortfolioPost);
        }
    }
}
