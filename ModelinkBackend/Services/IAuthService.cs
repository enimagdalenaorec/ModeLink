using System.Threading.Tasks;
using ModelinkBackend.Models.DTOs;

namespace ModelinkBackend.Services
{
    public interface IAuthService
    {
        Task<string> RegisterModelAsync(RegisterModelDto modelDto);
        Task<string> RegisterAgencyAsync(RegisterAgencyDto agencyDto);
        Task<string> LoginAsync(LoginDto loginDto);
        Task<string> AdminLoginAsync(LoginDto adminLoginDto);
        Task<string> GetUserRoleByUserIdAsync(int userId);
    }
}
