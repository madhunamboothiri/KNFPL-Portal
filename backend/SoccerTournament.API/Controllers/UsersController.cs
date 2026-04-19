using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerTournament.API.Models;
using SoccerTournament.API.Services;

namespace SoccerTournament.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "SuperAdmin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService users, ILogger<UsersController> logger)
    {
        _users = users;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _users.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _users.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateUserRequest request, IFormFile? profileImage)
    {
        if (string.IsNullOrWhiteSpace(request.Name)
            || string.IsNullOrWhiteSpace(request.Email)
            || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Name, email and password are required." });
        }

        try
        {
            var imageBytes = await ReadImageAsync(profileImage);
            var user = await _users.CreateAsync(request, imageBytes);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdateUserRequest request, IFormFile? profileImage)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "Name and email are required." });

        try
        {
            var imageBytes = await ReadImageAsync(profileImage);
            var user = await _users.UpdateAsync(id, request, imageBytes);
            return user is null ? NotFound() : Ok(user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _users.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private static async Task<byte[]?> ReadImageAsync(IFormFile? file)
    {
        if (file is null || file.Length == 0) return null;
        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        return ms.ToArray();
    }
}
