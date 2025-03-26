using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class Model : EntityBase
    {
        [Required]
        [ForeignKey("User")]
        public required int UserId { get; set; }
        public User User { get; set; } = null!; // One-to-One with User

        [Required]
        public required string FirstName { get; set; }

        [Required]
        public required string LastName { get; set; }

        [ForeignKey("Agency")]
        public int? AgencyId { get; set; } // Can be NULL if freelancer
        public Agency? Agency { get; set; }

        [ForeignKey("City")]
        public int? CityId { get; set; } // Can be NULL
        public City? City { get; set; }

        [Required]
        public required decimal Height { get; set; }

        [Required]
        public required decimal Weight { get; set; }

        [Required]
        public required string EyeColor { get; set; }

        [Required]
        public required string HairColor { get; set; }

        [Required]
        public required string SkinColor { get; set; }

        [Required]
        public required string Sex { get; set; } // 'male', 'female', 'non-binary'

        [Required]
        public required string ProfilePictureBase64 { get; set; }

        // Navigation properties
        public List<ModelStatusHistory> StatusHistory { get; set; } = new();
        public List<ModelApplication> ModelApplications { get; set; } = new();
        public List<FreelancerRequest> FreelancerRequests { get; set; } = new();
        public List<PortfolioPost> PortfolioPosts { get; set; } = new();
    }
}
