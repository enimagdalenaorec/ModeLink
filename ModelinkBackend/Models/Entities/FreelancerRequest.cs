using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class FreelancerRequest : EntityBase
    {
        [Required]
        [ForeignKey("Model")]
        public required int ModelId { get; set; }
        public Model Model { get; set; } = null!;

        [Required]
        [ForeignKey("Agency")]
        public required int AgencyId { get; set; }
        public Agency Agency { get; set; } = null!;

        [Required]
        public required string Status { get; set; } // 'pending', 'accepted', 'declined'

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    }
}
