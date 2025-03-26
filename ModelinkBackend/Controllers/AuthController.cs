using Microsoft.AspNetCore.Mvc;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Services;

namespace ModelinkBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register/model")]
        public async Task<IActionResult> RegisterModel([FromBody] RegisterModelDto modelDto)
        {
            try
            {
                var result = await _authService.RegisterModelAsync(modelDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register/agency")]
        public async Task<IActionResult> RegisterAgency([FromBody] RegisterAgencyDto agencyDto)
        {
            try
            {
                var result = await _authService.RegisterAgencyAsync(agencyDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
