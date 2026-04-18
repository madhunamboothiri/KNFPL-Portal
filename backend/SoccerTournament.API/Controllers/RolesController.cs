using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerTournament.API.Repositories;

namespace SoccerTournament.API.Controllers;

[ApiController]
[Route("api/roles")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IRoleRepository _roles;

    public RolesController(IRoleRepository roles) => _roles = roles;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _roles.GetAllAsync();
        return Ok(roles);
    }
}
