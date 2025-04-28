namespace ModelinkBackend.Models.DTOs
{
    public class UpdateEventDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? CityName { get; set; } = null!;
        public string? CountryName { get; set; } = null!;
        public string? CountryCode { get; set; } = null!;
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public DateTime EventStart { get; set; }
        public DateTime? EventFinish { get; set; }
        public string ProfilePicture { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
