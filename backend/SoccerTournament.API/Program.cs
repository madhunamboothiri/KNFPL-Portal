using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SoccerTournament.API.Database;
using SoccerTournament.API.Repositories;
using SoccerTournament.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Soccer Tournament API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── CORS ───────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── JWT Authentication ─────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("Jwt");
var secret = jwtSection["Secret"]
    ?? throw new InvalidOperationException("JWT Secret is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        };
    });

builder.Services.AddAuthorization();

// ── Database & DI ──────────────────────────────────────────
builder.Services.AddSingleton<IDbConnectionFactory, DbConnectionFactory>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<ITournamentRepository, TournamentRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddTransient<MigrationRunner>();
builder.Services.AddTransient<DatabaseSeeder>();

// ── Logging ────────────────────────────────────────────────
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// ──────────────────────────────────────────────────────────
var app = builder.Build();

// ── Run migrations and seed on startup ────────────────────
using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetRequiredService<MigrationRunner>().RunAsync();
    await scope.ServiceProvider.GetRequiredService<DatabaseSeeder>().SeedAsync();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Soccer Tournament API v1"));
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
