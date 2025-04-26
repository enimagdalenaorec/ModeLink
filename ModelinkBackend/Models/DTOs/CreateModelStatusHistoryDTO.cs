namespace ModelinkBackend.Models.DTOs
{
    public class CreateModelStatusHistoryDTO
    {
        public int ModelId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? AgencyId { get; set; } 
    }
}
