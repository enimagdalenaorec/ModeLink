namespace ModelinkBackend.Models.DTOs
{
    public class ModelApplicationForCalendarDTO
    {
        public int ApplicationId { get; set; }
        public int EventId { get; set; }
        public string EventName { get; set; } = string.Empty;
        public DateTime EventStart { get; set; }
        public DateTime EventFinish { get; set; }
    }
}
