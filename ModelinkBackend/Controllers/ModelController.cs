using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Models.DTOs;
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

        [HttpGet("getStatusAndAgencyId/{userId}")]
        public async Task<IActionResult> GetModelStatusAndAgencyId(int userId)
        {
            var modelStatusAndAgencyId = await _modelService.GetModelStatusAndAgencyIdAsync(userId);
            if (modelStatusAndAgencyId == null)
            {
                return NotFound();
            }
            return Ok(modelStatusAndAgencyId);
        }

        [HttpPost("toggleEventAttendance/{eventId}/{modelId}")]
        public async Task<IActionResult> ToggleEventAttendance(int eventId, int modelId)
        {
            var result = await _modelService.ToggleEventAttendanceAsync(eventId, modelId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to toggle attendance.");
        }

        // gets basic model info (without posts)
        [HttpGet("getModelDetails/{userId}")]
        public async Task<IActionResult> GetModelDetails(int userId)
        {
            var modelDetails = await _modelService.GetModelDetailsAsync(userId);
            if (modelDetails == null)
            {
                return NotFound();
            }
            return Ok(modelDetails);
        }

        // gets model portfolio (profile) posts
        [HttpGet("getPortfolioPosts/{modelId}")]
        public async Task<IActionResult> GetModelPortfolio(int modelId)
        {
            var portfolioPosts = await _modelService.GetPortfolioAsync(modelId);
            if (portfolioPosts == null)
            {
                return NotFound();
            }
            return Ok(portfolioPosts);
        }

        // updates basic model info
        [HttpPut("updateModelInfo/{modelId}")]
        public async Task<IActionResult> UpdateModelInfo(int modelId, [FromBody] UpdateModelInfoDTO updateModelInfoDTO)
        {
            if (modelId != updateModelInfoDTO.ModelId)
            {
                return BadRequest("Model ID mismatch.");
            }

            var result = await _modelService.UpdateModelInfoAsync(updateModelInfoDTO);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update model info.");
        }
    }
}
