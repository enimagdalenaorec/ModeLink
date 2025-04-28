using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Models.DTOs;
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

        [HttpPut("updateEvent/{eventId}")]
        public async Task<IActionResult> UpdateEvent(int eventId, [FromBody] UpdateEventDTO updateEventDTO)
        {
            if (eventId != updateEventDTO.Id)
            {
                return BadRequest("Event ID mismatch.");
            }

            var result = await _eventService.UpdateEvent(updateEventDTO);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

    }
}
