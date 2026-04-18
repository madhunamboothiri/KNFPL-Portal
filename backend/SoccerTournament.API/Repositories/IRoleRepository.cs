using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllAsync();
    Task<Role?> GetByIdAsync(Guid id);
}
