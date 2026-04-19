using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public interface ITournamentRepository
{
    Task<IEnumerable<Tournament>> GetAllAsync();
    Task<IEnumerable<Tournament>> GetByAdminIdAsync(Guid adminUserId);
    Task<Tournament?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(Tournament tournament, Guid createdBy);
    Task<bool> UpdateAsync(Tournament tournament, Guid modifiedBy);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> IsAdminAssignedAsync(Guid tournamentId, Guid userId);
}
