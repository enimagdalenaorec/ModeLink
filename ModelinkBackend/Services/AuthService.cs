using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Repositories;
using System;
using System.Text;
using System.Threading.Tasks;

namespace ModelinkBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtService _jwtService;

        public AuthService(IAuthRepository authRepository, JwtService jwtService)
        {
            _authRepository = authRepository;
            _jwtService = jwtService;
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            var user = await _authRepository.GetUserByEmailAsync(loginDto.Email);
            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password.");
            }

            // generate JWT token
            return _jwtService.GenerateToken(user.Id, user.Role);
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var enteredHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(enteredPassword)));
            return enteredHash == storedHash;
        }

        public async Task<string> RegisterModelAsync(RegisterModelDto modelDto)
        {
            // check if user already exists
            var existingUser = await _authRepository.GetUserByEmailAsync(modelDto.Email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            // hash password
            var hashedPassword = HashPassword(modelDto.Password);

            var newUser = new User
            {
                Email = modelDto.Email,
                PasswordHash = hashedPassword,
                Role = "model",
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(newUser); //  save User to get UserId

            var country = !string.IsNullOrEmpty(modelDto.CountryName)
            ? await _authRepository.GetCountryByNameAsync(modelDto.CountryName)
            : null;

            if (country == null && !string.IsNullOrEmpty(modelDto.CountryName) && !string.IsNullOrEmpty(modelDto.CountryCode))
            {
                // create new country
                country = new Country 
                {
                    Name = modelDto.CountryName,
                    Code = modelDto.CountryCode 
                };
                await _authRepository.CreateCountryAsync(country);
            }

            var city = !string.IsNullOrEmpty(modelDto.City)
                ? await _authRepository.GetCityByNameAsync(modelDto.City)
                : null;

            if (city == null && !string.IsNullOrEmpty(modelDto.City) && country != null)
            {
                // create new city
                city = new City
                {
                    Name = modelDto.City,
                    CountryId = country.Id // associate city with country if available
                };
                await _authRepository.CreateCityAsync(city);
            }

            var newModel = new Model
            {
                UserId = newUser.Id, 
                User = newUser,
                FirstName = modelDto.FirstName,
                LastName = modelDto.LastName,
                Height = modelDto.Height,
                Weight = modelDto.Weight,
                EyeColor = modelDto.EyeColor,
                HairColor = modelDto.HairColor,
                SkinColor = modelDto.SkinColor,
                Sex = modelDto.Sex,
                ProfilePictureBase64 = modelDto.ProfilePicture,
                City = city
            };

            // save Model
            await _authRepository.CreateModelAsync(newModel);
            // add row in ModelStatusHistories table
            CreateModelStatusHistoryDTO createModelStatusHistoryDTO = new CreateModelStatusHistoryDTO
            {
                ModelId = newModel.Id,
                Status = "freelancer",
                AgencyId = null, // nullable since model is after registration automatically freelancer
                CreatedAt = DateTime.UtcNow
            };
            await _authRepository.CreateModelStatusHistoryAsync(createModelStatusHistoryDTO);
            // generate JWT token --> automatically logs in the user
            return _jwtService.GenerateToken(newUser.Id, newUser.Role);
        }

        public async Task<string> RegisterAgencyAsync(RegisterAgencyDto agencyDto)
        {
            // check if user already exists
            var existingUser = await _authRepository.GetUserByEmailAsync(agencyDto.Email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            // hash password
            var hashedPassword = HashPassword(agencyDto.Password);

            var newUser = new User
            {
                Email = agencyDto.Email,
                PasswordHash = hashedPassword,
                Role = "agency",
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(newUser);

            var country = !string.IsNullOrEmpty(agencyDto.CountryName)
            ? await _authRepository.GetCountryByNameAsync(agencyDto.CountryName)
            : null;

            if (country == null && !string.IsNullOrEmpty(agencyDto.CountryName) && !string.IsNullOrEmpty(agencyDto.CountryCode))
            {
                country = new Country
                {
                    Name = agencyDto.CountryName,
                    Code = agencyDto.CountryCode
                };
                await _authRepository.CreateCountryAsync(country);
            }

            var city = !string.IsNullOrEmpty(agencyDto.City)
                ? await _authRepository.GetCityByNameAsync(agencyDto.City)
                : null;

            if (city == null && !string.IsNullOrEmpty(agencyDto.City) && country != null)
            {
                city = new City
                {
                    Name = agencyDto.City,
                    CountryId = country.Id
                };
                await _authRepository.CreateCityAsync(city);
            }

            // create Agency entity
            var newAgency = new Agency
            {
                UserId = newUser.Id,  
                User = newUser,
                Name = agencyDto.Name,
                Description = agencyDto.Description,
                Address = agencyDto.Address,
                ProfilePictureBase64 = agencyDto.ProfilePicture,
                CityId = city == null ? null : city.Id
            };

            // save Agency
            await _authRepository.CreateAgencyAsync(newAgency);
            // generate JWT token --> automatically logs in the user
            return _jwtService.GenerateToken(newUser.Id, newUser.Role);
        }

        private string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
