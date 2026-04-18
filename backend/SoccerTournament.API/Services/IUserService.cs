using SoccerTournament.API.Models;

namespace SoccerTournament.API.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto> CreateAsync(CreateUserRequest request);
}
