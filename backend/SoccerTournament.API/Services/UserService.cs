using SoccerTournament.API.Models;
using SoccerTournament.API.Repositories;

namespace SoccerTournament.API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly IRoleRepository _roles;

    public UserService(IUserRepository users, IRoleRepository roles)
    {
        _users = users;
        _roles = roles;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _users.GetAllAsync();
        return users.Select(ToDto);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        var role = await _roles.GetByIdAsync(request.RoleId)
            ?? throw new ArgumentException($"Role '{request.RoleId}' not found.");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            RoleId = role.Id,
            RoleName = role.Name,
        };

        var id = await _users.CreateAsync(user);
        user.Id = id;

        return ToDto(user);
    }

    private static UserDto ToDto(User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.RoleName,
        CreatedAt = u.CreatedAt,
    };
}
