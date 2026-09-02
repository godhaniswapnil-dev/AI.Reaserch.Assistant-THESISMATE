using Microsoft.EntityFrameworkCore;
using AIRESEARCHASSISTANT.Models;

namespace AIRESEARCHASSISTANT.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<ResearchPaper> ResearchPapers { get; set; }
    }
}
