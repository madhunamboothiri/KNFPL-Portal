namespace SoccerTournament.API.Models;

public class UserTournamentRow
{
    public Guid UserId { get; set; }
    public Guid TournamentId { get; set; }
    public string TournamentName { get; set; } = string.Empty;
}
