﻿using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IModelRepository
    {
        Task<IEnumerable<Model>> SearchModelsAsync(string name, string city, string country);
        Task<IEnumerable<Model>> GetModelSuggestionsAsync();
        Task<Model> GetModelByIdAsync(int userId);
        Task<Model> GetModelByModelIdAsync(int modelId);
        Task<ModelStatusHistory> GetLatestModelStatus(int userId);
        Task<bool> IsModelAttendingEventAsync(int eventId, int modelId);
        Task<bool> RemoveModelFromEventAsync(int eventId, int modelId);
        Task<bool> AddModelToEventAsync(int eventId, int modelId);
        Task<IEnumerable<PortfolioPost>> GetPortfolioPostsAsync(int modelId);
        Task<bool> UpdateModelInfoAsync(Model model);
        Task<Country?> GetCountryByNameAsync(string countryName);
        Task<City?> GetCityByNameAsync(string cityName);
        Task CreateCountryAsync(Country country);
        Task CreateCityAsync(City city);
        Task<PortfolioPost> GetPortfolioPostByIdAsync(int postId);
        Task<bool> UpdatePortfolioPostAsync(PortfolioPost portfolioPost);
        Task<bool> DeletePortfolioPostAsync(PortfolioPost postToUpdate);
        Task<bool> CreatePortfolioPostAsync(PortfolioPost postWithoutImages);
        Task<bool> AddPortfolioImageToPostAsync(PortfolioImage portfolioImage);
        Task<IEnumerable<FreelancerRequest>> GetFreelancerRequestsAsync(int modelId);
        Task<FreelancerRequest> CreateFreelancerRequestAsync(FreelancerRequest request);
        Task<FreelancerRequest> GetFreelancerRequestAsync(int agencyId, int modelId);
        Task<bool> DeleteFreelancerRequestAsync(FreelancerRequest request);
        Task<IEnumerable<Model>> GetModelsForAdminCrudAsync();
        Task<bool> DeleteModelAsync(Model model);
    }
}
