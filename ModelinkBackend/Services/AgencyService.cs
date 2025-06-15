using System.Collections.Generic;
using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;
using ModelinkBackend.Models.Entities;
using ModelinkBackend.Repositories;

namespace ModelinkBackend.Services
{
    public class AgencyService : IAgencyService
    {
        private readonly IAgencyRepository _agencyRepository;
        private readonly IModelRepository _modelRepository;
        private readonly IAuthRepository _authRepository;

        public AgencyService(IAgencyRepository agencyRepository, IModelRepository modelRepository, IAuthRepository authRepository)
        {
            _agencyRepository = agencyRepository;
            _modelRepository = modelRepository;
            _authRepository = authRepository;
        }

        public async Task<IEnumerable<AgencySearchDto>> SearchAgenciesAsync(string name, string city, string country)
        {
            var agencies = await _agencyRepository.SearchAgenciesAsync(name, city, country);

            return agencies.Select(a => new AgencySearchDto
            {
                UserId = a.UserId,
                Name = a.Name,
                CityName = a.City?.Name, // If null, return null
                CountryName = a.City?.Country?.Name, // If null, return null
                ProfilePicture = a.ProfilePictureBase64
            });
        }

        public async  Task<IEnumerable<AgencySuggestionDto>> GetAgencySuggestionsAsync()
        {
            var agencies = await _agencyRepository.GetAgencySuggestionsAsync();

            return agencies.Select(a => new AgencySuggestionDto
            {
                UserId = a.UserId,
                Name = a.Name,
                ProfilePicture = a.ProfilePictureBase64,
                CityName = a.City?.Name, // If null, return null
                CountryName = a.City?.Country?.Name // If null, return null
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name, 
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetOutsideSignedModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetOutsideSignedModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name,
            });
        }

        public async Task<IEnumerable<ModelSuggestionDto>> GetOutsideFreelanceModelsByAgencyIdAsync(int agencyId)
        {
            var models = await _agencyRepository.GetOutsideFreelanceModelsByAgencyIdAsync(agencyId);

            return models.Select(m => new ModelSuggestionDto
            {
                UserId = m.UserId,
                FirstName = m.FirstName,
                LastName = m.LastName,
                ProfilePicture = m.ProfilePictureBase64,
                CityName = m.City?.Name, // If null, return null
                CountryName = m.City?.Country?.Name, // If null, return null
                AgencyName = m.Agency?.Name, // should always be null
            });
        }

        public async Task<IEnumerable<EventCardDTO>> GetActiveEventsByAgencyIdAsync(int agencyId)
        {
            var events = await _agencyRepository.GetActiveEventsByAgencyIdAsync(agencyId);

            return events.Select(e => new EventCardDTO
            {
                Id = e.Id,
                Title = e.Title,
                AgencyName = e.Agency?.Name,
                CityName = e.City?.Name, // If null, return null
                CountryName = e.City?.Country?.Name, // If null, return null
                StartDate = e.EventStart.ToString("dd-MM-yyyy"),
                ProfilePicture = e.ProfilePictureBase64
            });
        }

        public async Task<AgencyInfoDto> GetAgencyInfoAsync(int userId)
        {
            var agency = await _agencyRepository.GetAgencyInfoAsync(userId);

            if (agency == null)
            {
                return null;
            }

            List<EventCardDTO> events = agency.Events
                .Select(e => new EventCardDTO
                {
                    Id = e.Id,
                    Title = e.Title,
                    AgencyName = agency.Name,
                    CityName = e.City?.Name, // If null, return null
                    CountryName = e.City?.Country?.Name, // If null, return null
                    StartDate = e.EventStart.ToString("dd-MM-yyyy"),
                    ProfilePicture = e.ProfilePictureBase64
                }).ToList();

            List<FreelancerRequestForAgency> freelancerRequests = agency.FreelancerRequests
                .Select(fr => new FreelancerRequestForAgency
                {
                    RequestId = fr.Id,
                    UserModelId = fr.Model.UserId,
                    ModelId = fr.ModelId,
                    ModelFirstName = fr.Model.FirstName,
                    ModelLastName = fr.Model.LastName,
                    ModelCityName = fr.Model.City?.Name, // ff null, return null
                    ModelCountryName = fr.Model.City?.Country?.Name, // if null, return null
                    ModelProfilePicture = fr.Model.ProfilePictureBase64,
                    Status = fr.Status.ToString(),
                    RequestedAt = fr.RequestedAt
                }).ToList();

            List<ModelSuggestionDto> models = agency.Models
                .Select(m => new ModelSuggestionDto
                {
                    UserId = m.UserId,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    ProfilePicture = m.ProfilePictureBase64,
                    CityName = m.City?.Name, // If null, return null
                    CountryName = m.City?.Country?.Name, // If null, return null
                    AgencyName = agency.Name,
                }).ToList();

            return new AgencyInfoDto
            {
                UserId = agency.UserId,
                AgencyId = agency.Id,
                Name = agency.Name,
                Email = agency.User.Email,
                Description = agency.Description,
                Address = agency.Address,
                ProfilePicture = agency.ProfilePictureBase64,
                CityName = agency.City?.Name, 
                CountryName = agency.City?.Country?.Name, 
                CountryCode = agency.City?.Country?.Code, 
                Models = models, // could be empty
                Events = events,   // could be empty
                FreelancerRequests = freelancerRequests   // could be empty
            };
        }

        public async Task<bool> AcceptFreelancerRequestAsync(int requestId)
        {
            FreelancerRequest req = await _agencyRepository.AcceptFreelancerRequestAsync(requestId);
            if (req == null)
            {
                return false; // request not found or could not be accepted
            }
            return true;
        }

        public async Task<bool> DeclineFreelancerRequestAsync(int requestId)
        {
            FreelancerRequest req = await _agencyRepository.DeclineFreelancerRequestAsync(requestId);
            if (req == null)
            {
                return false; // request not found or could not be declined
            }
            return true;
        }

        public async Task<bool> UnsignModelAsync(int userId)
        {
            Model model = await _agencyRepository.UnsignModelAsync(userId);
            if (model == null)
            {
                return false; // model not found or could not be unsigned
            }
            return true; // model successfully unsigned
        }

        public async Task<bool> UpdateAgencyInfoAsync(UpdateAgencyInfoDTO updateAgencyInfoDTO)
        {
            if (updateAgencyInfoDTO == null || updateAgencyInfoDTO.AgencyId <= 0)
            {
                return false; // invalid input
            }

            Agency agency = await _agencyRepository.GetAgencyByAgencyIdAsync(updateAgencyInfoDTO.AgencyId);
            if (agency == null)
            {
                return false; // agency not found
            }

            agency.Name = updateAgencyInfoDTO.Name;
            agency.User.Email = updateAgencyInfoDTO.Email;
            agency.Description = updateAgencyInfoDTO.Description;
            agency.Address = updateAgencyInfoDTO.Address;
            agency.ProfilePictureBase64 = updateAgencyInfoDTO.ProfilePicture;

            // retrieve the city and country (it possibly changed)
            var country = !string.IsNullOrEmpty(updateAgencyInfoDTO.CountryName)
                ? await _modelRepository.GetCountryByNameAsync(updateAgencyInfoDTO.CountryName)
                : null;
            if (country == null && !string.IsNullOrEmpty(updateAgencyInfoDTO.CountryName) && !string.IsNullOrEmpty(updateAgencyInfoDTO.CountryCode))
            {
                country = new Country
                {
                    Name = updateAgencyInfoDTO.CountryName,
                    Code = updateAgencyInfoDTO.CountryCode
                };
                await _modelRepository.CreateCountryAsync(country);
            }
            // check or create city
            var city = !string.IsNullOrEmpty(updateAgencyInfoDTO.CityName)
                ? await _modelRepository.GetCityByNameAsync(updateAgencyInfoDTO.CityName)
                : null;
            if (city == null && !string.IsNullOrEmpty(updateAgencyInfoDTO.CityName) && country != null)
            {
                city = new City
                {
                    Name = updateAgencyInfoDTO.CityName,
                    CountryId = country.Id
                };
                await _modelRepository.CreateCityAsync(city);
            }
            // assign city (country is already in the city) and address to the agency
            agency.City = city;

            return await _agencyRepository.UpdateAgencyAsync(agency);
        }

        public async Task<IEnumerable<AgenciesForAdminCrudDTO>> GetAgenciesForAdminCrudAsync()
        {
            // retrieve all agency entities
            var agencies = await _agencyRepository.GetAgenciesForAdminCrudAsync();
            // map to DTOs
            return agencies.Select(a => new AgenciesForAdminCrudDTO
            {
                AgencyId = a.Id,
                AgencyUserId = a.User.Id,
                Name = a.Name,
                Description = a.Description,
                Email = a.User.Email,
                Address = a.Address,
                CityName = a.City?.Name, // if null, return null
                CountryName = a.City?.Country?.Name, // if null, return null
                CountryCode = a.City?.Country?.Code, // if null, return null
                ProfilePicture = a.ProfilePictureBase64,
                Models = a.Models.Select(m => new ModelsForAgenciesForAdminCrudDTO
                {
                    ModelId = m.Id,
                    ModelUserId = m.User.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName
                }).ToList(),
                Events = a.Events.Select(e => new EventsForAgenciesForAdminCrudDTO
                {
                    Id = e.Id,
                    Title = e.Title
                }).ToList()
            });
        }

        public async Task<bool> AdminUpdateAgencyAsync(AgenciesForAdminCrudDTO agencyDto)
        {
            if (agencyDto == null || agencyDto.AgencyId <= 0 || agencyDto.AgencyUserId <= 0)
            {
                return false; // invalid input
            }

            Agency agency = await _agencyRepository.GetAgencyByAgencyIdAsync(agencyDto.AgencyId);
            if (agency == null || agency.User.Id != agencyDto.AgencyUserId)
            {
                return false; // agency not found or user ID mismatch
            }

            // Update agency properties
            agency.Name = agencyDto.Name;
            agency.User.Email = agencyDto.Email;
            agency.Description = agencyDto.Description;
            agency.ProfilePictureBase64 = agencyDto.ProfilePicture;
            // models and events need filtering since some may have been removed
            agency.Models = agency.Models
                .Where(m => agencyDto.Models.Any(mod => mod.ModelId == m.Id))
                .ToList();
            agency.Events = agency.Events
                .Where(e => agencyDto.Events.Any(ev => ev.Id == e.Id))
                .ToList();

            // retrieve the city and country (it possibly changed)
            var country = !string.IsNullOrEmpty(agencyDto.CountryName)
                ? await _modelRepository.GetCountryByNameAsync(agencyDto.CountryName)
                : null;

            if (country == null && !string.IsNullOrEmpty(agencyDto.CountryName) && !string.IsNullOrEmpty(agencyDto.CountryCode))
            {
                country = new Country
                {
                    Name = agencyDto.CountryName,
                    Code = agencyDto.CountryCode
                };
                await _modelRepository.CreateCountryAsync(country);
            }

            // check or create city
            var city = !string.IsNullOrEmpty(agencyDto.CityName)
                ? await _modelRepository.GetCityByNameAsync(agencyDto.CityName)
                : null;

            if (city == null && !string.IsNullOrEmpty(agencyDto.CityName) && country != null)
            {
                city = new City
                {
                    Name = agencyDto.CityName,
                    CountryId = country.Id
                };
                await _modelRepository.CreateCityAsync(city);
            }

            // assign city (country is already in the city) and address to the agency
            agency.City = city;
            agency.Address = agencyDto.Address;

            return await _agencyRepository.UpdateAgencyAsync(agency);
        }

        public async Task<bool> AdminDeleteAgencyAsync(int agencyUserId)
        {
            if (agencyUserId <= 0)
            {
                return false; // invalid input
            }

            Agency agency = await _agencyRepository.GetAgencyByUserIdAsync(agencyUserId);
            if (agency == null)
            {
                return false; // agency not found
            }

            // delete the agency
            await _agencyRepository.DeleteAgencyAsync(agency);
            //delete the user
            return await _authRepository.DeleteUserAsync(agencyUserId);
        }

        public async Task<bool> AdminCreateAgencyAsync(RegisterAgencyDto agencyDto)
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
            return true; // agency successfully created
        }

        private string HashPassword(string password)
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }


    }
}
