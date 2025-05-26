namespace ModelinkBackend.Models.DTOs
{
    public class UpdateAgencyInfoDTO
    {
        public int AgencyId { get; set; }
        public required string Name { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public required string Address { get; set; }
        public required string ProfilePicture { get; set; }

    }
}
