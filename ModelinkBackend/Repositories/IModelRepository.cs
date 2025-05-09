using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IModelRepository
    {
        Task<IEnumerable<Model>> SearchModelsAsync(string query);
        Task<IEnumerable<Model>> GetModelSuggestionsAsync();
        Task<Model> GetModelByIdAsync(int userId);
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
    }
}
