using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Services;
using System.Threading.Tasks;

namespace ModelinkBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelController : ControllerBase
    {
        private readonly IModelService _modelService;

        public ModelController(IModelService modelService)
        {
            _modelService = modelService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchModels([FromQuery] string query)
        {
            var models = await _modelService.SearchModelsAsync(query);
            return Ok(models);
        }
    }
}
