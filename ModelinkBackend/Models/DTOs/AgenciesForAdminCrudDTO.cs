namespace ModelinkBackend.Models.DTOs
{
    public class AgenciesForAdminCrudDTO
    {
        public int AgencyId { get; set; }
        public int AgencyUserId { get; set; } // UserId of the agency
        public string Name { get; set; } = null!;
        public string? Description { get; set; } // nullable if no description
        public string Email { get; set; } = null!; 
        public string? CityName { get; set; } 
        public string CountryName { get; set; } = null!; 
        public string AgencyAddress { get; set; } = null!;
        public string ProfilePicture { get; set; } = null!; // Base64 string of the profile picture
        public List<ModelsForAgenciesForAdminCrudDTO> Models { get; set; } = new();
        public List<EventsForAgenciesForAdminCrudDTO> Events { get; set; } = new(); 
    }

    public class ModelsForAgenciesForAdminCrudDTO
    {
        public int ModelId { get; set; }
        public int ModelUserId { get; set; } // UserId of the model
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
    }

    public class EventsForAgenciesForAdminCrudDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
    }
}
