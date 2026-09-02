using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AIRESEARCHASSISTANT.Data;
using AIRESEARCHASSISTANT.Models;
using AIRESEARCHASSISTANT.Services;

namespace AIRESEARCHASSISTANT.Controllers
{
    [ApiController]
    [Route("api/research")]
    public class ResearchApiController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly GeminiApiService _geminiService;

        public ResearchApiController(AppDbContext db, GeminiApiService geminiService)
        {
            _db = db;
            _geminiService = geminiService;
        }

        // POST: /api/research/generate
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] GenerateResearchRequest request)
        {
            if (request == null)
            {
                request = new GenerateResearchRequest();
            }

            // 1. Generate full academic research paper via Backend Gemini / Academic Engine
            var generatedPaper = await _geminiService.GeneratePaperAsync(request);

            // 2. Persist record directly in SQL Database [WebApp3Db].[dbo].[ResearchPapers]
            try
            {
                var topic = generatedPaper.ContainsKey("topic") ? generatedPaper["topic"]?.ToString() : request.Prompt;
                var style = generatedPaper.ContainsKey("style") ? generatedPaper["style"]?.ToString() : request.CitationStyle;
                var level = generatedPaper.ContainsKey("density") ? generatedPaper["density"]?.ToString() : request.CitationLevel;
                var lang = generatedPaper.ContainsKey("language") ? generatedPaper["language"]?.ToString() : request.Language;
                var status = generatedPaper.ContainsKey("status") ? generatedPaper["status"]?.ToString() : "Verified";
                var verifiedPct = generatedPaper.ContainsKey("verifiedPct") && int.TryParse(generatedPaper["verifiedPct"]?.ToString(), out var vp) ? vp : 100;

                var dbPaper = new ResearchPaper
                {
                    Topic = string.IsNullOrWhiteSpace(topic) ? "General Research" : topic.Trim(),
                    UserEmail = string.IsNullOrWhiteSpace(request.UserEmail) ? null : request.UserEmail.Trim(),
                    Username = string.IsNullOrWhiteSpace(request.Username) ? "Primary Researcher" : request.Username.Trim(),
                    CitationStyle = string.IsNullOrWhiteSpace(style) ? "APA 7th" : style.Trim(),
                    CitationLevel = string.IsNullOrWhiteSpace(level) ? "Sentence" : level.Trim(),
                    Language = string.IsNullOrWhiteSpace(lang) ? "English" : lang.Trim(),
                    Status = string.IsNullOrWhiteSpace(status) ? "Verified" : status.Trim(),
                    VerifiedPct = verifiedPct > 0 ? verifiedPct : 100,
                    CreatedAt = DateTime.UtcNow
                };

                _db.ResearchPapers.Add(dbPaper);
                await _db.SaveChangesAsync();

                generatedPaper["dbId"] = dbPaper.Id;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database Note on Paper Generate] {ex.Message}");
            }

            return Ok(generatedPaper);
        }

        // GET: /api/research
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? userEmail)
        {
            var query = _db.ResearchPapers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(userEmail))
            {
                var email = userEmail.Trim().ToLower();
                query = query.Where(r => r.UserEmail != null && r.UserEmail.ToLower() == email);
            }

            var papers = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
            return Ok(papers);
        }

        // GET: /api/research/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var paper = await _db.ResearchPapers.FindAsync(id);
            if (paper == null)
            {
                return NotFound(new { message = $"Research paper with ID {id} not found" });
            }

            return Ok(paper);
        }

        // POST: /api/research
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ResearchPaperDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Invalid research paper payload" });
            }

            var topic = !string.IsNullOrWhiteSpace(dto.Topic)
                ? dto.Topic.Trim()
                : (!string.IsNullOrWhiteSpace(dto.Title)
                    ? dto.Title.Trim()
                    : (!string.IsNullOrWhiteSpace(dto.Prompt) ? dto.Prompt.Trim() : "General Academic Research"));

            var paper = new ResearchPaper
            {
                Topic = topic,
                UserEmail = string.IsNullOrWhiteSpace(dto.UserEmail) ? null : dto.UserEmail.Trim(),
                Username = string.IsNullOrWhiteSpace(dto.Username) ? "Primary Researcher" : dto.Username.Trim(),
                CitationStyle = string.IsNullOrWhiteSpace(dto.CitationStyle) ? "APA 7th" : dto.CitationStyle.Trim(),
                CitationLevel = string.IsNullOrWhiteSpace(dto.CitationLevel) ? "Sentence" : dto.CitationLevel.Trim(),
                Language = string.IsNullOrWhiteSpace(dto.Language) ? "English" : dto.Language.Trim(),
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Verified" : dto.Status.Trim(),
                VerifiedPct = dto.VerifiedPct > 0 ? dto.VerifiedPct : 100,
                CreatedAt = DateTime.UtcNow
            };

            _db.ResearchPapers.Add(paper);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Research paper added to SQL Server database successfully", paper });
        }

        // PUT: /api/research/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ResearchPaperDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Invalid update payload" });
            }

            var paper = await _db.ResearchPapers.FindAsync(id);
            if (paper == null)
            {
                return NotFound(new { message = $"Research paper with ID {id} not found" });
            }

            if (!string.IsNullOrWhiteSpace(dto.Topic)) paper.Topic = dto.Topic.Trim();
            if (!string.IsNullOrWhiteSpace(dto.UserEmail)) paper.UserEmail = dto.UserEmail.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Username)) paper.Username = dto.Username.Trim();
            if (!string.IsNullOrWhiteSpace(dto.CitationStyle)) paper.CitationStyle = dto.CitationStyle.Trim();
            if (!string.IsNullOrWhiteSpace(dto.CitationLevel)) paper.CitationLevel = dto.CitationLevel.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Language)) paper.Language = dto.Language.Trim();
            if (!string.IsNullOrWhiteSpace(dto.Status)) paper.Status = dto.Status.Trim();
            if (dto.VerifiedPct > 0) paper.VerifiedPct = dto.VerifiedPct;

            paper.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Research paper updated successfully",
                paper
            });
        }

        // DELETE: /api/research/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var paper = await _db.ResearchPapers.FindAsync(id);
            if (paper == null)
            {
                return NotFound(new { message = $"Research paper with ID {id} not found" });
            }

            _db.ResearchPapers.Remove(paper);
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Research paper with ID {id} deleted successfully", deletedId = id });
        }
    }
}
