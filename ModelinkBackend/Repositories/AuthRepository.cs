using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Data;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Models.DTOs;
using System.Threading.Tasks;

namespace ModelinkBackend.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;

        public AuthRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync(); 
        }

        public async Task CreateModelAsync(Model model)
        {
            _context.Models.Add(model);
            await _context.SaveChangesAsync(); 
        }

        public async Task CreateAgencyAsync(Agency agency)
        {
            _context.Agencies.Add(agency);
            await _context.SaveChangesAsync(); 
        }

        public async Task<City> GetCityByNameAsync(string cityName)
        {
            return await _context.Cities.FirstOrDefaultAsync(c => c.Name == cityName);
        }

        public async Task<Country> GetCountryByNameAsync(string countryName)
        {
            return await _context.Countries.FirstOrDefaultAsync(c => c.Name == countryName);
        }

        public async Task CreateModelStatusHistoryAsync(CreateModelStatusHistoryDTO createModelStatusHistoryDto)
        {
            var modelStatusHistory = new ModelStatusHistory
            {
                ModelId = createModelStatusHistoryDto.ModelId,
                AgencyId = createModelStatusHistoryDto.AgencyId,
                Status = createModelStatusHistoryDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.ModelStatusHistories.Add(modelStatusHistory);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCountryAsync(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
        }

        public async Task CreateCityAsync(City city)
        {
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            _context.Users.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
