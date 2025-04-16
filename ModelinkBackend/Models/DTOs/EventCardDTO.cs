namespace ModelinkBackend.Models.DTOs
{
    public class EventCardDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string AgencyName { get; set; }
        public string? CityName { get; set; }
        public string? CountryName { get; set; }
        public string StartDate { get; set; }
        public string? ProfilePicture { get; set; } 
    }
}
