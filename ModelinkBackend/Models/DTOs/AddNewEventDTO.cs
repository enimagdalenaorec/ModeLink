namespace ModelinkBackend.Models.DTOs
{
    public class AddNewEventDTO
    {
        public int AgencyId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Address { get; set; } = null!;
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; } = null!; // ISO code of the country
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime EventStart { get; set; }
        public DateTime? EventFinish { get; set; }
        public string? ProfilePicture { get; set; }

    }
}
