using Dapper;
using SoccerTournament.API.Database;
using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnectionFactory _db;

    public UserRepository(IDbConnectionFactory db) => _db = db;

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        const string sql = """
            SELECT u.id, u.name, u.email, u.password_hash AS PasswordHash,
                   u.role_id AS RoleId, r.name AS RoleName, u.created_at AS CreatedAt
            FROM users u
            JOIN roles r ON r.id = u.role_id
            ORDER BY u.created_at DESC
            """;

        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<User>(sql);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        const string sql = """
            SELECT u.id, u.name, u.email, u.password_hash AS PasswordHash,
                   u.role_id AS RoleId, r.name AS RoleName, u.created_at AS CreatedAt
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE u.id = @Id
            """;

        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        const string sql = """
            SELECT u.id, u.name, u.email, u.password_hash AS PasswordHash,
                   u.role_id AS RoleId, r.name AS RoleName, u.created_at AS CreatedAt
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE u.email = @Email
            """;

        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task<Guid> CreateAsync(User user)
    {
        const string sql = """
            INSERT INTO users (id, name, email, password_hash, role_id, created_at)
            VALUES (@Id, @Name, @Email, @PasswordHash, @RoleId, @CreatedAt)
            RETURNING id
            """;

        user.Id = Guid.NewGuid();
        user.CreatedAt = DateTime.UtcNow;

        using var conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<Guid>(sql, user);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = "DELETE FROM users WHERE id = @Id";
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id });
        return rows > 0;
    }
}
