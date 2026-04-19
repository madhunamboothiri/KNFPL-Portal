namespace SoccerTournament.API.Models;

public class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? DateOfBirth { get; set; }
    public List<string>? TournamentIds { get; set; }
}
