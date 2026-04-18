using Dapper;
using SoccerTournament.API.Database;
using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly IDbConnectionFactory _db;

    public RoleRepository(IDbConnectionFactory db) => _db = db;

    public async Task<IEnumerable<Role>> GetAllAsync()
    {
        const string sql = "SELECT id, name FROM roles ORDER BY name";
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<Role>(sql);
    }

    public async Task<Role?> GetByIdAsync(Guid id)
    {
        const string sql = "SELECT id, name FROM roles WHERE id = @Id";
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<Role>(sql, new { Id = id });
    }
}
