namespace ModelinkBackend.Models.DTOs
{
    public class PortfolioPostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
