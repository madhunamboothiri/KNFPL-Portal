namespace SoccerTournament.API.Models;

public class TournamentDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public int NumberOfTeams { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public string? ModifiedByName { get; set; }
}
