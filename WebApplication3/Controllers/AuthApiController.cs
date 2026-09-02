using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using AIRESEARCHASSISTANT.Models;
using AIRESEARCHASSISTANT.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace AIRESEARCHASSISTANT.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthApiController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        private string GenerateJwtToken(User user)
        {
            var key = _config["Jwt:Key"] ?? "ThisIsASecretKeyForDevelopmentOnlyChangeIt";
            var issuer = _config["Jwt:Issuer"] ?? "WebApplication3";
            var audience = _config["Jwt:Audience"] ?? "WebApplication3Clients";
            var durationMinutes = int.TryParse(_config["Jwt:DurationMinutes"], out var m) ? m : 60;

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName ?? user.Email),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(durationMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Password
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found" });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Password
            });
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid payload" });

            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with ID {id} not found" });

            string oldEmail = user.Email;

            // If updating email, check for duplicates with other users
            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email.Trim().ToLower() != user.Email.ToLower())
            {
                var trimmedEmail = dto.Email.Trim();
                var exists = await _db.Users.AnyAsync(u => u.Email.ToLower() == trimmedEmail.ToLower() && u.Id != id);
                if (exists)
                    return Conflict(new { message = "Email is already in use by another user" });

                user.Email = trimmedEmail;
            }

            if (!string.IsNullOrWhiteSpace(dto.FullName))
            {
                user.FullName = dto.FullName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.Password = dto.Password;
            }

            // Sync any existing ResearchPapers in database with the new email/name
            if (!string.IsNullOrWhiteSpace(oldEmail) && oldEmail.ToLower() != user.Email.ToLower())
            {
                var userPapers = await _db.ResearchPapers
                    .Where(p => p.UserEmail != null && p.UserEmail.ToLower() == oldEmail.ToLower())
                    .ToListAsync();

                foreach (var p in userPapers)
                {
                    p.UserEmail = user.Email;
                    p.Username = user.FullName;
                }
            }

            await _db.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return Ok(new
            {
                message = "User updated successfully",
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    password = user.Password
                },
                token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email))
                return BadRequest("Invalid payload");

            var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
            if (exists) return Conflict("Email already registered");

            var user = new User
            {
                FullName = dto.FullName ?? string.Empty,
                Email = dto.Email,
                // Direct plain-text password stored without encryption
                Password = dto.Password ?? string.Empty
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // generate token for the newly registered user
            var token = GenerateJwtToken(user);
            return Ok(new { token, user = new { id = user.Id, fullName = user.FullName, email = user.Email } });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email))
                return BadRequest("Invalid payload");

            var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            bool isPasswordValid = false;

            // 1. Direct plain text check
            if (user.Password == (dto.Password ?? string.Empty))
            {
                isPasswordValid = true;
            }
            else
            {
                // 2. Backward compatibility: if old user was stored as a hash, verify & migrate DB to plain text!
                try
                {
                    var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
                    var result = hasher.VerifyHashedPassword(user, user.Password, dto.Password ?? string.Empty);
                    if (result == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success)
                    {
                        isPasswordValid = true;
                        // Migrate and save plain text password into database so it is visible
                        user.Password = dto.Password ?? string.Empty;
                        await _db.SaveChangesAsync();
                    }
                }
                catch
                {
                    // Ignore format exceptions
                }
            }

            if (isPasswordValid)
            {
                // generate JWT token and return to client
                var token = GenerateJwtToken(user);
                return Ok(new { token, user = new { id = user.Id, fullName = user.FullName ?? user.Email, email = user.Email } });
            }

            return Unauthorized("Invalid credentials");
        }
    }
}
