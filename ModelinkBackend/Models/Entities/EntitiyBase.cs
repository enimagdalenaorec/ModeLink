using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public abstract class EntityBase
    {
        [Key]
        public int Id { get; set; }
    }
}
