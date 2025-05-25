namespace ModelinkBackend.Models.DTOs
{
    public class FreelancerRequestForAgency
    {
        public int RequestId { get; set; }
        public int UserModelId { get; set; }
        public int ModelId { get; set; }
        public string ModelFirstName { get; set; } = string.Empty;
        public string ModelLastName { get; set; } = string.Empty;
        public string ModelCityName { get; set; } = string.Empty;
        public string ModelCountryName { get; set; } = string.Empty;
        public string ModelProfilePicture { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
