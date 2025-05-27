namespace ModelinkBackend.Models.DTOs
{
    public class ModelSearchDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AgencyName { get; set; } // nullable, in case the model is not in an agency
        public string? CityName { get; set; }
        public string? CountryName { get; set; }
        public string ProfilePicture { get; set; }
        public string? Gender { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public string? EyeColor { get; set; }
        public string? HairColor { get; set; }
        public string? SkinColor { get; set; }
    }
}
