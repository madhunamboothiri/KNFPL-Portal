using Dapper;
using SoccerTournament.API.Database;
using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public class TournamentRepository : ITournamentRepository
{
    private readonly IDbConnectionFactory _db;

    public TournamentRepository(IDbConnectionFactory db) => _db = db;

    private const string SelectColumns = """
        SELECT t.id, t.name, t.type, t.logo,
               t.number_of_teams AS NumberOfTeams, t.is_active AS IsActive,
               t.created_at AS CreatedAt, t.created_by AS CreatedById, uc.name AS CreatedByName,
               t.modified_at AS ModifiedAt, t.modified_by AS ModifiedById, um.name AS ModifiedByName
        FROM tournaments t
        LEFT JOIN users uc ON uc.id = t.created_by
        LEFT JOIN users um ON um.id = t.modified_by
        """;

    public async Task<IEnumerable<Tournament>> GetAllAsync()
    {
        var sql = $"{SelectColumns} ORDER BY t.created_at DESC";
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<Tournament>(sql);
    }

    public async Task<IEnumerable<Tournament>> GetByAdminIdAsync(Guid adminUserId)
    {
        var sql = $"""
            {SelectColumns}
            JOIN tournament_admins ta ON ta.tournament_id = t.id AND ta.user_id = @UserId
            ORDER BY t.created_at DESC
            """;
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<Tournament>(sql, new { UserId = adminUserId });
    }

    public async Task<Tournament?> GetByIdAsync(Guid id)
    {
        var sql = $"{SelectColumns} WHERE t.id = @Id";
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<Tournament>(sql, new { Id = id });
    }

    public async Task<Guid> CreateAsync(Tournament t, Guid createdBy)
    {
        const string sql = """
            INSERT INTO tournaments (id, name, type, logo, number_of_teams, is_active, created_at, created_by)
            VALUES (@Id, @Name, @Type, @Logo, @NumberOfTeams, @IsActive, @CreatedAt, @CreatedBy)
            RETURNING id
            """;
        t.Id = Guid.NewGuid();
        t.CreatedAt = DateTime.UtcNow;
        using var conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<Guid>(sql, new
        {
            t.Id, t.Name, t.Type, t.Logo, t.NumberOfTeams, t.IsActive, t.CreatedAt, CreatedBy = createdBy
        });
    }

    public async Task<bool> UpdateAsync(Tournament t, Guid modifiedBy)
    {
        const string sql = """
            UPDATE tournaments
            SET name            = @Name,
                type            = @Type,
                logo            = COALESCE(@Logo, logo),
                number_of_teams = @NumberOfTeams,
                is_active       = @IsActive,
                modified_at     = NOW(),
                modified_by     = @ModifiedBy
            WHERE id = @Id
            """;
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new
        {
            t.Name, t.Type, t.Logo, t.NumberOfTeams, t.IsActive, ModifiedBy = modifiedBy, t.Id
        });
        return rows > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = "DELETE FROM tournaments WHERE id = @Id";
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id });
        return rows > 0;
    }

    public async Task<bool> IsAdminAssignedAsync(Guid tournamentId, Guid userId)
    {
        const string sql = "SELECT COUNT(1) FROM tournament_admins WHERE tournament_id = @TournamentId AND user_id = @UserId";
        using var conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<int>(sql, new { TournamentId = tournamentId, UserId = userId }) > 0;
    }
}
