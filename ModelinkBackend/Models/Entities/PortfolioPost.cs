using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class PortfolioPost : EntityBase
    {
        [Required]
        [ForeignKey("Model")]
        public required int ModelId { get; set; }
        public Model Model { get; set; } = null!;

        [Required]
        public required string Title { get; set; }

        public string? Description { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation (?)
        public List<PortfolioImage> PortfolioImages { get; set; } = new();
    }
}
