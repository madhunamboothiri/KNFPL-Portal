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

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        return user is null ? null : ToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request, byte[]? profileImage)
    {
        var role = await _roles.GetByIdAsync(request.RoleId)
            ?? throw new ArgumentException($"Role '{request.RoleId}' not found.");

        await CheckEmailUnique(request.Email, excludeId: null);
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            await CheckPhoneUnique(request.PhoneNumber, excludeId: null);

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            RoleId = role.Id,
            RoleName = role.Name,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            DateOfBirth = ParseDate(request.DateOfBirth),
            ProfileImage = profileImage,
        };

        var id = await _users.CreateAsync(user);
        user.Id = id;

        return ToDto(user);
    }

    public async Task<UserDto?> UpdateAsync(Guid id, UpdateUserRequest request, byte[]? profileImage)
    {
        var existing = await _users.GetByIdAsync(id);
        if (existing is null) return null;

        var role = await _roles.GetByIdAsync(request.RoleId)
            ?? throw new ArgumentException($"Role '{request.RoleId}' not found.");

        await CheckEmailUnique(request.Email, excludeId: id);
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            await CheckPhoneUnique(request.PhoneNumber, excludeId: id);

        existing.Name = request.Name;
        existing.Email = request.Email;
        existing.RoleId = role.Id;
        existing.RoleName = role.Name;
        existing.PhoneNumber = request.PhoneNumber;
        existing.Address = request.Address;
        existing.DateOfBirth = ParseDate(request.DateOfBirth);

        if (profileImage is not null)
            existing.ProfileImage = profileImage;

        await _users.UpdateAsync(existing);
        return ToDto(existing);
    }

    public Task<bool> DeleteAsync(Guid id) => _users.DeleteAsync(id);

    public async Task<UserDto?> UpdateProfileAsync(Guid id, UpdateProfileRequest request, byte[]? profileImage)
    {
        var existing = await _users.GetByIdAsync(id);
        if (existing is null) return null;

        await CheckEmailUnique(request.Email, excludeId: id);
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            await CheckPhoneUnique(request.PhoneNumber, excludeId: id);

        existing.Name = request.Name;
        existing.Email = request.Email;
        existing.PhoneNumber = request.PhoneNumber;
        existing.Address = request.Address;
        existing.DateOfBirth = ParseDate(request.DateOfBirth);

        if (profileImage is not null)
            existing.ProfileImage = profileImage;

        await _users.UpdateAsync(existing);
        return ToDto(existing);
    }

    public async Task<UserDto?> CompleteFirstLoginAsync(Guid id, CompleteFirstLoginRequest request, byte[]? profileImage)
    {
        var existing = await _users.GetByIdAsync(id);
        if (existing is null) return null;

        await CheckEmailUnique(request.Email, excludeId: id);
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            await CheckPhoneUnique(request.PhoneNumber, excludeId: id);

        existing.Name = request.Name;
        existing.Email = request.Email;
        existing.PhoneNumber = request.PhoneNumber;
        existing.Address = request.Address;
        existing.DateOfBirth = ParseDate(request.DateOfBirth);
        if (profileImage is not null)
            existing.ProfileImage = profileImage;

        await _users.UpdateAsync(existing);
        await _users.UpdatePasswordAsync(id, BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12));
        await _users.SetNeverLoggedAsync(id, true);

        existing.NeverLogged = true;
        return ToDto(existing);
    }

    public async Task<bool> ChangePasswordAsync(Guid id, string currentPassword, string newPassword)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null) return false;

        if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect.");

        var hash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 12);
        return await _users.UpdatePasswordAsync(id, hash);
    }

    private async Task CheckEmailUnique(string email, Guid? excludeId)
    {
        var existing = await _users.GetByEmailAsync(email);
        if (existing is not null && existing.Id != excludeId)
            throw new ArgumentException("Email address is already in use.");
    }

    private async Task CheckPhoneUnique(string phone, Guid? excludeId)
    {
        var existing = await _users.GetByPhoneAsync(phone);
        if (existing is not null && existing.Id != excludeId)
            throw new ArgumentException("Phone number is already in use.");
    }

    private static DateTime? ParseDate(string? value) =>
        DateTime.TryParse(value, out var d) ? d : null;

    private static UserDto ToDto(User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.RoleName,
        PhoneNumber = u.PhoneNumber,
        Address = u.Address,
        DateOfBirth = u.DateOfBirth?.ToString("yyyy-MM-dd"),
        ProfileImage = u.ProfileImage is { Length: > 0 }
            ? Convert.ToBase64String(u.ProfileImage)
            : null,
        NeverLogged = u.NeverLogged,
        CreatedAt = u.CreatedAt,
    };
}
