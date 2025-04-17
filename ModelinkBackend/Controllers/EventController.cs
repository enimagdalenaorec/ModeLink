using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ModelinkBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class EventController : Controller
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet("getEventDetails/{eventId}/{userId}")]
        public async Task<IActionResult> GetEventDetails(int eventId, int userId)
        {
            var eventDetails = await _eventService.GetEventDetails(eventId, userId);
            if (eventDetails == null)
            {
                return NotFound();
            }
            return Ok(eventDetails);
        }

    }
}
