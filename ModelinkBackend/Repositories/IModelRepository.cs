using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IModelRepository
    {
        Task<IEnumerable<Model>> SearchModelsAsync(string query);
    }
}
