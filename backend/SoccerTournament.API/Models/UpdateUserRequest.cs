namespace SoccerTournament.API.Models;

public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? DateOfBirth { get; set; }
}
