namespace AIRESEARCHASSISTANT.Models
{
    public class ResearchPaperDto
    {
        public string? Title { get; set; }
        public string? Topic { get; set; }
        public string? Prompt { get; set; }
        public string? UserEmail { get; set; }
        public string? Username { get; set; }
        public int Pages { get; set; } = 30;
        public string? CitationStyle { get; set; } = "APA 7th";
        public string? CitationLevel { get; set; } = "Sentence";
        public string? Language { get; set; } = "English";
        public string? Status { get; set; } = "Verified";
        public int VerifiedPct { get; set; } = 100;
    }
}
