using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

namespace ModelinkBackend.Repositories
{
    public interface IEventRepository
    {
        Task<Event?> GetEventDetailsAsync(int eventId);
        Task<Event?> GetEventByIdAsync(int eventId);
        Task<City?> GetCityByNameAsync(string cityName);
        Task<Event?> UpdateEventAsync(Event eventToUpdate);
        Task<Country?> GetCountryByNameAsync(string countryName);
        Task CreateCountryAsync(Country country);
        Task CreateCityAsync(City city);

    }
}
