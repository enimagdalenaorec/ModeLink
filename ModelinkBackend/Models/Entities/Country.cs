using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class Country : EntityBase
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Code { get; set; } // 'US', 'FR', 'HR'

        // Navigation property
        public List<City> Cities { get; set; } = new();
    }
}
