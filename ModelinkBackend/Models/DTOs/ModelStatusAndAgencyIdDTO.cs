namespace ModelinkBackend.Models.DTOs
{
    public class ModelStatusAndAgencyIdDTO
    {
        public string Status { get; set; } // "signed" or "freelancer"
        public int? AgencyId { get; set; } // Nullable if the model is freelance
    }
}
