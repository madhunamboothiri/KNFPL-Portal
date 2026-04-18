using SoccerTournament.API.Models;

namespace SoccerTournament.API.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(string email, string password);
}
