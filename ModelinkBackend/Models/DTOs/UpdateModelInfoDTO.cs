﻿namespace ModelinkBackend.Models.DTOs
{
    public class UpdateModelInfoDTO
    {
        public int ModelId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string EyeColor { get; set; }
        public string HairColor { get; set; }
        public string SkinColor { get; set; }
        public string Gender { get; set; }
        public string ProfilePicture { get; set; }
    }
}
