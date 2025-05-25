using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ModelinkBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgencyController : ControllerBase
    {
        private readonly IAgencyService _agencyService;

        public AgencyController(IAgencyService agencyService)
        {
            _agencyService = agencyService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAgencies([FromQuery] string query)
        {
            var agencies = await _agencyService.SearchAgenciesAsync(query);
            return Ok(agencies);
        }

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetAgencySuggestions()
        {
            var agencySuggestions = await _agencyService.GetAgencySuggestionsAsync();
            return Ok(agencySuggestions);
        }

        //[Authorize]
        [HttpGet("models/{agencyId}")]
        public async Task<IActionResult> GetModelsByAgencyId(int agencyId)
        {
            // check if the user is authorized to access this endpoint (if the logged in agency asks for its models)
            //var loggedInAgencyId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            //if (agencyId != loggedInAgencyId)
            //{
            //    return Forbid();
            //}
            var models = await _agencyService.GetModelsByAgencyIdAsync(agencyId);
            return Ok(models);
        }

        [HttpGet("outsideSignedModels/{agencyId}")]
        public async Task<IActionResult> GetOutsideSignedModelsByAgencyId(int agencyId)
        {
            var models = await _agencyService.GetOutsideSignedModelsByAgencyIdAsync(agencyId);
            return Ok(models);
        }

        [HttpGet("outsideFreelanceModels/{agencyId}")]
        public async Task<IActionResult> GetOutsideFreelanceModelsByAgencyId(int agencyId)
        {
            var models = await _agencyService.GetOutsideFreelanceModelsByAgencyIdAsync(agencyId);
            return Ok(models);
        }

        [HttpGet("activeEvents/{agencyId}")]
        public async Task<IActionResult> GetActiveEventsByAgencyId(int agencyId)
        {
            var events = await _agencyService.GetActiveEventsByAgencyIdAsync(agencyId);
            return Ok(events);
        }

        [HttpGet("agencyInfo/{userId}")]
        public async Task<IActionResult> GetAgencyInfo(int userId)
        {
            var agencyInfo = await _agencyService.GetAgencyInfoAsync(userId);
            return Ok(agencyInfo);
        }

        [HttpPost("acceptFreelancerRequest/{requestId}")]
        public async Task<IActionResult> AcceptFreelancerRequest(int requestId)
        {
            var result = await _agencyService.AcceptFreelancerRequestAsync(requestId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to accept freelancer request.");
        }

        [HttpPost("declineFreelancerRequest/{requestId}")]
        public async Task<IActionResult> DeclineFreelancerRequest(int requestId)
        {
            var result = await _agencyService.DeclineFreelancerRequestAsync(requestId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to decline freelancer request.");
        }

        [HttpPost("unsignModel/{userId}")]
        public async Task<IActionResult> UnsignModel(int userId)
        {
            // userId is user id for the model to be unsigned
            var result = await _agencyService.UnsignModelAsync(userId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to unsign model.");
        }
    }
}
