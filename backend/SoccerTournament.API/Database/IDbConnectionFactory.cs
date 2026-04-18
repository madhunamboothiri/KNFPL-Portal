using System.Data;

namespace SoccerTournament.API.Database;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}
