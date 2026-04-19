using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerTournament.API.Models;
using SoccerTournament.API.Services;

namespace SoccerTournament.API.Controllers;

[ApiController]
[Route("api/tournaments")]
[Authorize]
public class TournamentsController : ControllerBase
{
    private readonly ITournamentService _tournaments;

    public TournamentsController(ITournamentService tournaments) => _tournaments = tournaments;

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new InvalidOperationException("User ID claim missing."));

    private string CurrentRole =>
        User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (CurrentRole == "TournamentAdmin")
        {
            var mine = await _tournaments.GetByAdminIdAsync(CurrentUserId);
            return Ok(mine);
        }
        var all = await _tournaments.GetAllAsync();
        return Ok(all);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var t = await _tournaments.GetByIdAsync(id);
        if (t is null) return NotFound();
        if (CurrentRole == "TournamentAdmin")
        {
            var assigned = await _tournaments.IsAdminAssignedAsync(id, CurrentUserId);
            if (!assigned) return Forbid();
        }
        return Ok(t);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Create([FromForm] CreateTournamentRequest request, IFormFile? logo)
    {
        try
        {
            var logoBytes = await ReadImageAsync(logo);
            var created = await _tournaments.CreateAsync(request, logoBytes, CurrentUserId);
            return Ok(created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateTournamentRequest request, IFormFile? logo)
    {
        try
        {
            var logoBytes = await ReadImageAsync(logo);
            var updated = await _tournaments.UpdateAsync(id, request, logoBytes, CurrentUserId);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _tournaments.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    private static async Task<byte[]?> ReadImageAsync(IFormFile? file)
    {
        if (file is null || file.Length == 0) return null;
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        return ms.ToArray();
    }
}
