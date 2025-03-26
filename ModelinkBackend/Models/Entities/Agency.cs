using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class Agency : EntityBase
    {
        [Required]
        [ForeignKey("User")]
        public required int UserId { get; set; }
        public User User { get; set; } = null!; // One-to-One with User

        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        [Required]
        [ForeignKey("City")]
        public required int CityId { get; set; }
        public City City { get; set; } = null!;

        [Required]
        public required string Address { get; set; }

        [Required]
        public required string ProfilePictureBase64 { get; set; }

        // Navigation properties
        public List<Model> Models { get; set; } = new();
        public List<Event> Events { get; set; } = new();
        public List<FreelancerRequest> FreelancerRequests { get; set; } = new();
    }
}
