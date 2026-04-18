using Dapper;

namespace SoccerTournament.API.Database;

public class DatabaseSeeder
{
    private readonly IDbConnectionFactory _db;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(IDbConnectionFactory db, ILogger<DatabaseSeeder> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        using var conn = await _db.CreateConnectionAsync();

        _logger.LogInformation("Seeding roles...");

        await conn.ExecuteAsync("""
            INSERT INTO roles (id, name) VALUES
                ('00000000-0000-0000-0000-000000000001', 'SuperAdmin'),
                ('00000000-0000-0000-0000-000000000002', 'TournamentAdmin'),
                ('00000000-0000-0000-0000-000000000003', 'TeamManager'),
                ('00000000-0000-0000-0000-000000000004', 'Player')
            ON CONFLICT (name) DO NOTHING
            """);

        _logger.LogInformation("Seeding default admin user...");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123", workFactor: 12);

        await conn.ExecuteAsync("""
            INSERT INTO users (id, name, email, password_hash, role_id, created_at)
            VALUES (
                gen_random_uuid(),
                'Super Admin',
                'admin@soccer.local',
                @PasswordHash,
                '00000000-0000-0000-0000-000000000001',
                now()
            )
            ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
            """, new { PasswordHash = passwordHash });

        _logger.LogInformation("Seeding complete.");
    }
}
