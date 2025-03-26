using Microsoft.EntityFrameworkCore;
using ModelinkBackend.Data;
using ModelinkBackend.Models.Entities;
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
            await _context.SaveChangesAsync(); // ✅ Save the user to the database
        }

        public async Task CreateModelAsync(Model model)
        {
            _context.Models.Add(model);
            await _context.SaveChangesAsync(); // ✅ Save the model
        }

        public async Task CreateAgencyAsync(Agency agency)
        {
            _context.Agencies.Add(agency);
            await _context.SaveChangesAsync(); // ✅ Save the agency
        }

        public async Task<City> GetCityByNameAsync(string cityName)
        {
            return await _context.Cities.FirstOrDefaultAsync(c => c.Name == cityName);
        }

        public async Task<Country> GetCountryByNameAsync(string countryName)
        {
            return await _context.Countries.FirstOrDefaultAsync(c => c.Name == countryName);
        }
    }
}
