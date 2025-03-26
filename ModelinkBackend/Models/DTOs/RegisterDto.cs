﻿namespace ModelinkBackend.Models.DTOs
{
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; } // "model", "agency", "admin (?)"
    }
}
