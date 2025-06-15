using Microsoft.AspNetCore.Authorization;
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
        private readonly IAuthService _authService;

        public ModelController(IModelService modelService, IAuthService authService)
        {
            _modelService = modelService;
            _authService = authService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchModels([FromQuery] string? name, [FromQuery] string? city, [FromQuery] string? country)
        {
            var models = await _modelService.SearchModelsAsync(name, city, country);
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

        [HttpPost("toggleEventAttendance/{eventId}/{userModelId}")]
        [Authorize] 
        public async Task<IActionResult> ToggleEventAttendance(int eventId, int userModelId)
        {
            var result = await _modelService.ToggleEventAttendanceAsync(eventId, userModelId);
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
        [Authorize]
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

        // updates model portfolio (profile) posts
        [HttpPut("updatePortfolioPost/{modelId}")]
        [Authorize]
        public async Task<IActionResult> UpdatePortfolioPost(int modelId, [FromBody] PortfolioPostDTO portfolioPost)
        {
            var result = await _modelService.UpdateModelPortfolioAsync(modelId, portfolioPost);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update portfolio posts.");
        }

        // deletes model portfolio (profile) posts
        [HttpDelete("deletePortfolioPost/{modelId}/{postId}")]
        [Authorize]
        public async Task<IActionResult> DeletePortfolioPost(int modelId, int postId)
        {
            var result = await _modelService.DeleteModelPortfolioPostAsync(modelId, postId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to delete portfolio post.");
        }

        // creates a new model portfolio (profile) post
        [HttpPost("createPortfolioPost/{modelId}")]
        [Authorize]
        public async Task<IActionResult> CreatePortfolioPost(int modelId, [FromBody] CreatePortfolioPostDTO portfolioPost)
        {
            var result = await _modelService.CreateModelPortfolioAsync(modelId, portfolioPost);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to create portfolio post.");
        }

        // get model's sent request if the model is a freelancer
        [HttpGet("getFreelancerRequests/{modelId}")]
        public async Task<IActionResult> GetFreelancerRequests(int modelId)
        {
            var requests = await _modelService.GetFreelancerRequestsAsync(modelId);
            if (requests == null)
            {
                return NotFound();
            }
            return Ok(requests);
        }

        [HttpPost("requestToJoin/{agencyId}/{modelUserId}")]
        [Authorize]
        public async Task<IActionResult> RequestToJoinAgency(int agencyId, int modelUserId)
        {
            var result = await _modelService.RequestToJoinAgencyAsync(agencyId, modelUserId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to send request to join agency.");
        }

        [HttpPost("cancelRequestToJoin/{agencyId}/{modelUserId}")]
        [Authorize]
        public async Task<IActionResult> CancelRequestToJoinAgency(int agencyId, int modelUserId)
        {
            var result = await _modelService.CancelRequestToJoinAgencyAsync(agencyId, modelUserId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to cancel request to join agency.");
        }

        [HttpGet("getModelsForAdminCrud/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetModelsForAdminCrud(int userId)
        {
            var userRole = await _authService.GetUserRoleByUserIdAsync(userId);
            if (userRole != "admin")
            {
                return Unauthorized("Only admins can access this endpoint.");
            }
            var modelsForAdminCrud = await _modelService.GetModelsForAdminCrudAsync();
            if (modelsForAdminCrud == null)
            {
                return NotFound();
            }
            return Ok(modelsForAdminCrud);
        }

        [HttpPut("adminUpdateModel/{modelUserId}")]
        [Authorize]
        public async Task<IActionResult> AdminUpdateModel(int modelUserId, [FromBody] ModelsForAdminCrudDTO updatedModel)
        {
            if (modelUserId != updatedModel.ModelUserId)
            {
                return BadRequest("Model ID mismatch.");
            }

            var result = await _modelService.AdminUpdateModelAsync(updatedModel);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update model info.");
        }

        [HttpDelete("adminDeleteModel/{modelUserId}")]
        [Authorize]
        public async Task<IActionResult> AdminDeleteModel(int modelUserId)
        {
            var result = await _modelService.AdminDeleteModelAsync(modelUserId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to delete model.");
        }

        [HttpPost("adminCreateModel")]
        [Authorize]
        public async Task<IActionResult> AdminCreateModel([FromBody] RegisterModelDto modelDto)
        {
            try
            {
                var createdModel = await _modelService.AdminCreateModelAsync(modelDto); // tu se ne vraća token
                if (!createdModel)
                {
                    return BadRequest("Failed to create model.");
                }
                return Ok(); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
