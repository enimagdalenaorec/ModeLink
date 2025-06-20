﻿using Microsoft.AspNetCore.Authorization;
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
        public async Task<IActionResult> GetEventDetailsAsync(int eventId, int userId)
        {
            var eventDetails = await _eventService.GetEventDetailsAsync(eventId, userId);
            if (eventDetails == null)
            {
                return NotFound();
            }
            return Ok(eventDetails);
        }

        [HttpPut("updateEvent/{eventId}")]
        [Authorize]
        public async Task<IActionResult> UpdateEventAsync(int eventId, [FromBody] UpdateEventDTO updateEventDTO)
        {
            if (eventId != updateEventDTO.Id)
            {
                return BadRequest("Event ID mismatch.");
            }

            var result = await _eventService.UpdateEventAsync(updateEventDTO);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpDelete("deleteEvent/{eventId}")]
        [Authorize]
        public async Task<IActionResult> DeleteEventAsync(int eventId)
        {
            var result = await _eventService.DeleteEventAsync(eventId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost("addEvent/{agencyId}")]
        [Authorize]
        public async Task<IActionResult> AddEventAsync(int agencyId, [FromBody] AddNewEventDTO addNewEventDTO)
        {
            if (agencyId != addNewEventDTO.AgencyId)
            {
                return BadRequest("Agency ID mismatch.");
            }

            var result = await _eventService.AddEventAsync(addNewEventDTO);
            if (!(bool)result)
            {
                return BadRequest("Failed to add event.");
            }
            return Ok(result);
        }

    }
}
