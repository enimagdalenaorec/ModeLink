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

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetModelSuggestions()
        {
            var modelSuggestions = await _modelService.GetModelSuggestionsAsync();
            return Ok(modelSuggestions);
        }

        [HttpGet("getStatusAndAgencyId/{modelId}")]
        public async Task<IActionResult> GetModelStatusAndAgencyId(int modelId)
        {
            var modelStatusAndAgencyId = await _modelService.GetModelStatusAndAgencyIdAsync(modelId);
            if (modelStatusAndAgencyId == null)
            {
                return NotFound();
            }
            return Ok(modelStatusAndAgencyId);
        }
    }
}
