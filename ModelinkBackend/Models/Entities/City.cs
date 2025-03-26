using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;

namespace ModelinkBackend.Models.Entities
{
    public class City : EntityBase
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        [ForeignKey("Country")]
        public required int CountryId { get; set; }
        public Country Country { get; set; } = null!;

        // Navigation properties
        public List<Model> Models { get; set; } = new();
        public List<Agency> Agencies { get; set; } = new();
        public List<Event> Events { get; set; } = new();
    }
}
