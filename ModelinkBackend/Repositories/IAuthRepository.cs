using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;

public interface IAuthRepository
{
    Task<User> GetUserByEmailAsync(string email);
    Task CreateUserAsync(User user);  
    Task CreateModelAsync(Model model);
    Task CreateAgencyAsync(Agency agency);
    Task<City> GetCityByNameAsync(string cityName);
    Task<Country> GetCountryByNameAsync(string countryName);
    Task CreateModelStatusHistoryAsync(CreateModelStatusHistoryDTO createModelStatusHistoryDto);
    Task CreateCountryAsync(Country country);
    Task CreateCityAsync(City city);
    Task<User> GetUserByIdAsync(int userId);
}
