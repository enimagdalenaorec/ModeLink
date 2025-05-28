namespace ModelinkBackend.Models.DTOs
{
    public class ModelsForAdminCrudDTO
    {
        public int ModelId { get; set; }
        public int ModelUserId { get; set; } // UserId of the model
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? AgencyName { get; set; } // nullable if freelancer
        public int? AgencyId { get; set; } // nullable
        public string? CityName { get; set; } // nullable if no city
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string EyeColor { get; set; } = null!;
        public string HairColor { get; set; } = null!;
        public string SkinColor { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public string ProfilePicture { get; set; } = null!; // Base64 string of the profile picture
        public List<ModelApplicationsForCrudDisplayDTO> Applications { get; set; } = new List<ModelApplicationsForCrudDisplayDTO>();        // display of active events thar model is attending
        public List<FreelancerRequestsForCrudDisplayDTO> FreelancerRequests { get; set; } = new List<FreelancerRequestsForCrudDisplayDTO>(); // display of pending freelancer requests
        public List<PortfolioPostsForCrudDisplayDTO> PortfolioPosts { get; set; } = new List<PortfolioPostsForCrudDisplayDTO>(); // display of portfolio posts

    }

    public class ModelApplicationsForCrudDisplayDTO
    {
        public int Id { get; set; }
        public string EventName { get; set; } = null!;
        public string AgencyName { get; set; } = null!;
    }

    public class FreelancerRequestsForCrudDisplayDTO
    {
        public int Id { get; set; }
        public string AgencyName { get; set; } = null!;
    }

    public class PortfolioPostsForCrudDisplayDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
    }
}
