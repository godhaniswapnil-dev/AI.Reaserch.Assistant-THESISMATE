using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIRESEARCHASSISTANT.Models
{
    [Table("ResearchPapers")]
    public class ResearchPaper
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Topic { get; set; } = string.Empty;

        public string? UserEmail { get; set; }

        public string? Username { get; set; }


        public string CitationStyle { get; set; } = "APA 7th";

        public string CitationLevel { get; set; } = "Sentence";

        public string Language { get; set; } = "English";

        public string Status { get; set; } = "Verified";

        public int VerifiedPct { get; set; } = 100;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
