﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ModelinkBackend.Models.Entities
{
    public class Event : EntityBase
    {
        [Required]
        [ForeignKey("Agency")]
        public required int AgencyId { get; set; }
        public Agency Agency { get; set; } = null!;

        [Required]
        public required string Title { get; set; }

        public string? Description { get; set; }

        [Required]
        public required string Address { get; set; }

        [Required]
        [ForeignKey("City")]
        public required int CityId { get; set; }
        public City City { get; set; } = null!;

        [Column(TypeName = "decimal(9,6)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal? Longitude { get; set; }

        [Required]
        public required DateTime EventStart { get; set; }

        public DateTime? EventFinish { get; set; }

        public string? ProfilePictureBase64 { get; set; }

        [Required]
        public required string Status { get; set; } // 'active', 'inactive'

        public List<ModelApplication> ModelApplications { get; set; } = new();
    }
}
