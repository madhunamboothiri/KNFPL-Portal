using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerTournament.API.Models;
using SoccerTournament.API.Services;

namespace SoccerTournament.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IUserService _users;

    public ProfileController(IUserService users) => _users = users;

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new InvalidOperationException("User ID claim missing."));

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var user = await _users.GetByIdAsync(CurrentUserId);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromForm] UpdateProfileRequest request, IFormFile? profileImage)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "Name and email are required." });

        var imageBytes = await ReadImageAsync(profileImage);
        var user = await _users.UpdateProfileAsync(CurrentUserId, request, imageBytes);
        if (user is null) return NotFound();

        return Ok(user);
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { error = "Both current and new password are required." });

        if (request.NewPassword.Length < 6)
            return BadRequest(new { error = "New password must be at least 6 characters." });

        try
        {
            var ok = await _users.ChangePasswordAsync(CurrentUserId, request.CurrentPassword, request.NewPassword);
            return ok ? NoContent() : NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private static async Task<byte[]?> ReadImageAsync(IFormFile? file)
    {
        if (file is null || file.Length == 0) return null;
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        return ms.ToArray();
    }
}
