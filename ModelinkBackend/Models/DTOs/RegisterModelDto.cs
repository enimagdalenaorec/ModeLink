namespace ModelinkBackend.Models.DTOs
{
    public class RegisterModelDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "model";
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }  // Just the name of the city (no city entity passed)
        public string? CountryName { get; set; }  // Optional
        public string? CountryCode { get; set; }  // Optional
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string EyeColor { get; set; }
        public string SkinColor { get; set; }
        public string HairColor { get; set; }
        public string Sex { get; set; }
        public string ProfilePicture { get; set; }  // Base64 string
    }
}
