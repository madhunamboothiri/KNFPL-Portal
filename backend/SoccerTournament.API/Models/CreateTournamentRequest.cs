namespace SoccerTournament.API.Models;

public class CreateTournamentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int NumberOfTeams { get; set; }
    public bool IsActive { get; set; } = true;
}
