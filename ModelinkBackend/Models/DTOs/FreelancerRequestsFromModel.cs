namespace ModelinkBackend.Models.DTOs
{
    public class FreelancerRequestsFromModel
    {
        public int UserAgencyId { get; set; }
        public int AgencyId { get; set; }
        public string AgencyName { get; set; } = string.Empty;
        public string AgencyProfilePicture { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
