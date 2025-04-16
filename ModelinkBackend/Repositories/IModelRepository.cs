using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IModelRepository
    {
        Task<IEnumerable<Model>> SearchModelsAsync(string query);
        Task<IEnumerable<Model>> GetModelSuggestionsAsync();
        Task<Model> GetModelByIdAsync(int modelId);
        Task<ModelStatusHistory> GetLatestModelStatus(int modelId);
    }
}
