using SoccerTournament.API.Models;
using SoccerTournament.API.Repositories;

namespace SoccerTournament.API.Services;

public class TournamentService : ITournamentService
{
    private readonly ITournamentRepository _tournaments;

    public TournamentService(ITournamentRepository tournaments)
    {
        _tournaments = tournaments;
    }

    public async Task<IEnumerable<TournamentDto>> GetAllAsync()
    {
        var list = await _tournaments.GetAllAsync();
        return list.Select(ToDto);
    }

    public async Task<IEnumerable<TournamentDto>> GetByAdminIdAsync(Guid adminUserId)
    {
        var list = await _tournaments.GetByAdminIdAsync(adminUserId);
        return list.Select(ToDto);
    }

    public async Task<TournamentDto?> GetByIdAsync(Guid id)
    {
        var t = await _tournaments.GetByIdAsync(id);
        return t is null ? null : ToDto(t);
    }

    public async Task<TournamentDto> CreateAsync(CreateTournamentRequest request, byte[]? logo, Guid createdBy)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Tournament name is required.");
        if (!new[] { "5s", "7s", "9s", "11s" }.Contains(request.Type))
            throw new ArgumentException("Invalid tournament type. Must be 5s, 7s, 9s, or 11s.");
        if (request.NumberOfTeams < 2)
            throw new ArgumentException("Number of teams must be at least 2.");

        var tournament = new Tournament
        {
            Name = request.Name,
            Type = request.Type,
            Logo = logo,
            NumberOfTeams = request.NumberOfTeams,
            IsActive = request.IsActive,
        };

        var id = await _tournaments.CreateAsync(tournament, createdBy);
        tournament.Id = id;
        return ToDto(tournament);
    }

    public async Task<TournamentDto?> UpdateAsync(Guid id, UpdateTournamentRequest request, byte[]? logo, Guid modifiedBy)
    {
        var existing = await _tournaments.GetByIdAsync(id);
        if (existing is null) return null;

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Tournament name is required.");
        if (!new[] { "5s", "7s", "9s", "11s" }.Contains(request.Type))
            throw new ArgumentException("Invalid tournament type.");
        if (request.NumberOfTeams < 2)
            throw new ArgumentException("Number of teams must be at least 2.");

        existing.Name = request.Name;
        existing.Type = request.Type;
        existing.NumberOfTeams = request.NumberOfTeams;
        existing.IsActive = request.IsActive;
        if (logo is not null)
            existing.Logo = logo;

        await _tournaments.UpdateAsync(existing, modifiedBy);
        return ToDto(existing);
    }

    public Task<bool> DeleteAsync(Guid id) => _tournaments.DeleteAsync(id);

    public Task<bool> IsAdminAssignedAsync(Guid tournamentId, Guid userId) =>
        _tournaments.IsAdminAssignedAsync(tournamentId, userId);

    private static TournamentDto ToDto(Tournament t) => new()
    {
        Id = t.Id,
        Name = t.Name,
        Type = t.Type,
        Logo = t.Logo is { Length: > 0 } ? Convert.ToBase64String(t.Logo) : null,
        NumberOfTeams = t.NumberOfTeams,
        IsActive = t.IsActive,
        CreatedAt = t.CreatedAt,
        CreatedByName = t.CreatedByName,
        ModifiedAt = t.ModifiedAt,
        ModifiedByName = t.ModifiedByName,
    };
}
