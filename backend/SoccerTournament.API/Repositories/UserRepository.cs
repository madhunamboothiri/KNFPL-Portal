using Dapper;
using SoccerTournament.API.Database;
using SoccerTournament.API.Models;

namespace SoccerTournament.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly IDbConnectionFactory _db;

    public UserRepository(IDbConnectionFactory db) => _db = db;

    private const string SelectColumns = """
        SELECT u.id, u.name, u.email, u.password_hash AS PasswordHash,
               u.role_id AS RoleId, r.name AS RoleName,
             u.phone_number AS PhoneNumber, u.address,
             u.date_of_birth AS DateOfBirth, u.profile_image AS ProfileImage,
             u.never_logged AS NeverLogged,
             u.created_at AS CreatedAt
        FROM users u
        JOIN roles r ON r.id = u.role_id
        """;

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        var sql = $"{SelectColumns} ORDER BY u.created_at DESC";
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<User>(sql);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        var sql = $"{SelectColumns} WHERE u.id = @Id";
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(sql, new { Id = id });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var sql = $"{SelectColumns} WHERE u.email = @Email";
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(sql, new { Email = email });
    }

    public async Task<User?> GetByPhoneAsync(string phone)
    {
        var sql = $"{SelectColumns} WHERE u.phone_number = @Phone";
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<User>(sql, new { Phone = phone });
    }

    public async Task<Guid> CreateAsync(User user)
    {
        const string sql = """
            INSERT INTO users (id, name, email, password_hash, role_id,
                               phone_number, address, date_of_birth, profile_image, never_logged, created_at)
            VALUES (@Id, @Name, @Email, @PasswordHash, @RoleId,
                    @PhoneNumber, @Address, @DateOfBirth, @ProfileImage, @NeverLogged, @CreatedAt)
            RETURNING id
            """;

        user.Id = Guid.NewGuid();
        user.CreatedAt = DateTime.UtcNow;
        user.NeverLogged = false;

        using var conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<Guid>(sql, user);
    }

    public async Task<bool> UpdateAsync(User user)
    {
        const string sql = """
            UPDATE users
            SET name          = @Name,
                email         = @Email,
                role_id       = @RoleId,
                phone_number  = @PhoneNumber,
                address       = @Address,
                date_of_birth = @DateOfBirth,
                profile_image = @ProfileImage
            WHERE id = @Id
            """;

        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, user);
        return rows > 0;
    }

    public async Task<bool> UpdatePasswordAsync(Guid id, string passwordHash)
    {
        const string sql = "UPDATE users SET password_hash = @PasswordHash WHERE id = @Id";
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { PasswordHash = passwordHash, Id = id });
        return rows > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        const string sql = "DELETE FROM users WHERE id = @Id";
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Id = id });
        return rows > 0;
    }

    public async Task<bool> SetNeverLoggedAsync(Guid id, bool value)
    {
        const string sql = "UPDATE users SET never_logged = @Value WHERE id = @Id";
        using var conn = _db.CreateConnection();
        var rows = await conn.ExecuteAsync(sql, new { Value = value, Id = id });
        return rows > 0;
    }

    public async Task<IEnumerable<UserTournamentRow>> GetAllUserTournamentsAsync()
    {
        const string sql = """
            SELECT ta.user_id AS UserId, ta.tournament_id AS TournamentId, t.name AS TournamentName
            FROM tournament_admins ta
            JOIN tournaments t ON t.id = ta.tournament_id
            """;
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<UserTournamentRow>(sql);
    }

    public async Task<IEnumerable<UserTournamentRow>> GetUserTournamentsAsync(Guid userId)
    {
        const string sql = """
            SELECT ta.user_id AS UserId, ta.tournament_id AS TournamentId, t.name AS TournamentName
            FROM tournament_admins ta
            JOIN tournaments t ON t.id = ta.tournament_id
            WHERE ta.user_id = @UserId
            """;
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<UserTournamentRow>(sql, new { UserId = userId });
    }

    public async Task SetUserTournamentsAsync(Guid userId, IEnumerable<Guid> tournamentIds)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync("DELETE FROM tournament_admins WHERE user_id = @UserId", new { UserId = userId });
        foreach (var tid in tournamentIds)
        {
            await conn.ExecuteAsync(
                "INSERT INTO tournament_admins (tournament_id, user_id) VALUES (@TournamentId, @UserId) ON CONFLICT DO NOTHING",
                new { TournamentId = tid, UserId = userId });
        }
    }
}
