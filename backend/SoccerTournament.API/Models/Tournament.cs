namespace SoccerTournament.API.Models;

public class Tournament
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public byte[]? Logo { get; set; }
    public int NumberOfTeams { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public Guid? ModifiedById { get; set; }
    public string? ModifiedByName { get; set; }
}
