namespace ModelinkBackend.Models.DTOs
{
    public class CreatePortfolioPostDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<string> Images { get; set; } = new List<string>();
    }
}
