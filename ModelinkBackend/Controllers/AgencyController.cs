using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Services;
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
    }
}
