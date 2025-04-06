namespace ModelinkBackend.Models.DTOs
{
    public class AgencySuggestionDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? CityName { get; set; }
        public string? CountryName { get; set; }
        public string ProfilePicture { get; set; }
    }
}
