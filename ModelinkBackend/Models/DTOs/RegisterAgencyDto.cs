namespace ModelinkBackend.Models.DTOs
{
    public class RegisterAgencyDto 
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "model";
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Address { get; set; }
        public string? City { get; set; }  // Optional, Just the name of the city (no city entity passed)
        public string? CountryName { get; set; }  // Optional
        public string? CountryCode { get; set; }  // Optional
        public string ProfilePicture { get; set; }  // Base64 string
    }
}
