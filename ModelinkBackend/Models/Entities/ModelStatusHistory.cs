using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class ModelStatusHistory : EntityBase
    {
        [Required]
        [ForeignKey("Model")]
        public required int ModelId { get; set; }
        public Model Model { get; set; } = null!;

        [ForeignKey("Agency")]
        public int? AgencyId { get; set; } // NULL if freelancer
        public Agency? Agency { get; set; }

        [Required]
        public required string Status { get; set; } // 'freelancer', 'signed'

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
