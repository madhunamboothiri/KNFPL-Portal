using System.Reflection;
using Dapper;

namespace SoccerTournament.API.Database;

public class MigrationRunner
{
    private readonly IDbConnectionFactory _db;
    private readonly ILogger<MigrationRunner> _logger;

    private const string ResourcePrefix = "SoccerTournament.API.Database.Migrations.";

    public MigrationRunner(IDbConnectionFactory db, ILogger<MigrationRunner> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task RunAsync()
    {
        using var conn = await _db.CreateConnectionAsync();

        await conn.ExecuteAsync("""
            CREATE TABLE IF NOT EXISTS __migrations (
                id         SERIAL       PRIMARY KEY,
                name       VARCHAR(200) NOT NULL UNIQUE,
                applied_at TIMESTAMPTZ  NOT NULL DEFAULT now()
            )
            """);

        var applied = (await conn.QueryAsync<string>("SELECT name FROM __migrations ORDER BY name"))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var pending = Assembly.GetExecutingAssembly()
            .GetManifestResourceNames()
            .Where(r => r.StartsWith(ResourcePrefix) && r.EndsWith(".sql"))
            .OrderBy(r => r)
            .ToList();

        if (pending.Count == 0)
        {
            _logger.LogWarning("No embedded migration files found under {Prefix}", ResourcePrefix);
            return;
        }

        foreach (var resourceName in pending)
        {
            var migrationName = resourceName[ResourcePrefix.Length..];

            if (applied.Contains(migrationName))
            {
                _logger.LogDebug("Migration already applied: {Name}", migrationName);
                continue;
            }

            _logger.LogInformation("Applying migration: {Name}", migrationName);

            var sql = ReadEmbeddedResource(resourceName);

            using var tx = conn.BeginTransaction();
            try
            {
                await conn.ExecuteAsync(sql, transaction: tx);
                await conn.ExecuteAsync(
                    "INSERT INTO __migrations (name) VALUES (@name)",
                    new { name = migrationName },
                    tx);
                tx.Commit();
                _logger.LogInformation("Migration applied: {Name}", migrationName);
            }
            catch
            {
                tx.Rollback();
                _logger.LogError("Migration failed, rolled back: {Name}", migrationName);
                throw;
            }
        }
    }

    private static string ReadEmbeddedResource(string resourceName)
    {
        using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"Embedded resource not found: {resourceName}");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
