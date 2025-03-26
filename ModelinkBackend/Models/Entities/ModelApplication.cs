using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class ModelApplication : EntityBase
    {
        [Required]
        [ForeignKey("Model")]
        public required int ModelId { get; set; }
        public Model Model { get; set; } = null!;

        [Required]
        [ForeignKey("Event")]
        public required int EventId { get; set; }
        public Event Event { get; set; } = null!;

        [Required]
        public required string Status { get; set; } // 'attending', 'not attending'

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
}
