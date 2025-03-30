namespace ModelinkBackend.Models.DTOs
{
    public class ModelSearchDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? AgencyId { get; set; } // nullable, in case the model is not in an agency
        public string? CityName { get; set; }
        public string? CountryName { get; set; }
        public string ProfilePicture { get; set; }
    }
}
