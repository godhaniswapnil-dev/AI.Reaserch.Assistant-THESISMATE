namespace AIRESEARCHASSISTANT.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        // Stored as plain text password without encryption
        public string? Password { get; set; } 
    }
}
