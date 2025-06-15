using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
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
        private readonly IAuthService _authService;

        public AgencyController(IAgencyService agencyService, IAuthService authService)
        {
            _agencyService = agencyService;
            _authService = authService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchAgencies([FromQuery] string? name, [FromQuery] string? city, [FromQuery] string? country)
        {
            var agencies = await _agencyService.SearchAgenciesAsync(name, city, country);
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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

        [HttpPost("updateInfo/{agencyId}")]
        [Authorize]
        public async Task<IActionResult> UpdateAgencyInfo(int agencyId, [FromBody] UpdateAgencyInfoDTO updateAgencyInfoDTO)
        {
            if (updateAgencyInfoDTO.AgencyId != agencyId)
            {
                return BadRequest("Agency ID mismatch.");
            }

            var result = await _agencyService.UpdateAgencyInfoAsync(updateAgencyInfoDTO);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update agency information.");
        }

        [HttpGet("getAgenciesForAdminCrud/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetAgencyForAdminCrud(int userId)
        {
            var userRole = await _authService.GetUserRoleByUserIdAsync(userId);
            if (userRole != "admin")
            {
                return Unauthorized("Only admins can access this endpoint.");
            }
            var agencies = await _agencyService.GetAgenciesForAdminCrudAsync();
            if (agencies == null)
            {
                return NotFound();
            }
            return Ok(agencies);
        }

        [HttpPut("adminUpdateAgency/{agencyUserId}")]
        [Authorize]
        public async Task<IActionResult> AdminUpdateAgency(int agencyUserId, [FromBody] AgenciesForAdminCrudDTO agencyDto)
        {
            if (agencyDto.AgencyUserId != agencyUserId)
            {
                return BadRequest("Agency user ID mismatch.");
            }

            var result = await _agencyService.AdminUpdateAgencyAsync(agencyDto);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to update agency information.");
        }

        [HttpDelete("adminDeleteAgency/{agencyUserId}")]
        [Authorize]
        public async Task<IActionResult> AdminDeleteAgency(int agencyUserId)
        {
            var result = await _agencyService.AdminDeleteAgencyAsync(agencyUserId);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to delete agency.");
        }

        [HttpPost("adminCreateAgency")]
        [Authorize]
        public async Task<IActionResult> AdminCreateAgency([FromBody] RegisterAgencyDto createAgencyDto)
        {
            if (createAgencyDto == null)
            {
                return BadRequest("Invalid agency data.");
            }

            var result = await _agencyService.AdminCreateAgencyAsync(createAgencyDto);
            if (result)
            {
                return Ok();
            }
            return BadRequest("Failed to create agency.");
        }
    }
}
