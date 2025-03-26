using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class PortfolioImage : EntityBase
    {
        [Required]
        [ForeignKey("PortfolioPost")]
        public required int PostId { get; set; }
        public PortfolioPost PortfolioPost { get; set; } = null!;

        [Required]
        public required string ImageBase64 { get; set; }
    }
}
