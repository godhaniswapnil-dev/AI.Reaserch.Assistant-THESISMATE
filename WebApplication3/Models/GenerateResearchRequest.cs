using System.Collections.Generic;

namespace AIRESEARCHASSISTANT.Models
{
    public class GenerateResearchRequest
    {
        public string? Prompt { get; set; }
        public int Pages { get; set; } = 30;
        public string? CitationStyle { get; set; } = "APA 7th";
        public string? CitationLevel { get; set; } = "Sentence";
        public string? Language { get; set; } = "English";
        public List<string>? Databases { get; set; }
        public string? UserEmail { get; set; }
        public string? Username { get; set; }
    }
}
