using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Services
{
    public interface IModelService
    {
        Task<IEnumerable<ModelSearchDto>> SearchModelsAsync(string query);
        Task<IEnumerable<ModelSuggestionDto>> GetModelSuggestionsAsync();
    }
}
