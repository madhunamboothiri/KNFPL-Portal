using SoccerTournament.API.Models;

namespace SoccerTournament.API.Services;

public interface ITournamentService
{
    Task<IEnumerable<TournamentDto>> GetAllAsync();
    Task<IEnumerable<TournamentDto>> GetByAdminIdAsync(Guid adminUserId);
    Task<TournamentDto?> GetByIdAsync(Guid id);
    Task<TournamentDto> CreateAsync(CreateTournamentRequest request, byte[]? logo, Guid createdBy);
    Task<TournamentDto?> UpdateAsync(Guid id, UpdateTournamentRequest request, byte[]? logo, Guid modifiedBy);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> IsAdminAssignedAsync(Guid tournamentId, Guid userId);
}
