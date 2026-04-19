using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByPhoneAsync(string phone);
    Task<Guid> CreateAsync(User user);
    Task<bool> UpdateAsync(User user);
    Task<bool> UpdatePasswordAsync(Guid id, string passwordHash);
    Task<bool> DeleteAsync(Guid id);
}
