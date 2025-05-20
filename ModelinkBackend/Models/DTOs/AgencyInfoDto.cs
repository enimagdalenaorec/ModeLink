namespace ModelinkBackend.Models.DTOs
{
    public class AgencyInfoDto
    {
        public int UserId { get; set; }
        public int AgencyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Address { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
        public string? CityName { get; set; } = string.Empty;
        public string? CountryName { get; set; } = string.Empty;
        public string? CountryCode { get; set; } = string.Empty;
        public List<ModelSuggestionDto>? Models { get; set; } = new List<ModelSuggestionDto>();
        public List<EventCardDTO>? Events { get; set; } = new List<EventCardDTO>();
        public List<FreelancerRequestForAgency>? FreelancerRequests { get; set; } = new List<FreelancerRequestForAgency>();
    }
}
