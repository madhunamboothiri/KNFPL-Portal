using SoccerTournament.API.Models;

namespace SoccerTournament.API.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserRequest request, byte[]? profileImage);
    Task<UserDto?> UpdateAsync(Guid id, UpdateUserRequest request, byte[]? profileImage);
    Task<bool> DeleteAsync(Guid id);
    Task<UserDto?> UpdateProfileAsync(Guid id, UpdateProfileRequest request, byte[]? profileImage);
    Task<bool> ChangePasswordAsync(Guid id, string currentPassword, string newPassword);
}
