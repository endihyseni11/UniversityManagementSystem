using System.ComponentModel.DataAnnotations;

namespace UniversityManagementSystem.Models
{
    public class Management
    {
        [Key]
        public int management_id { get; set; }
        public string position { get; set; }
        public int user_id { get; set; }
        public int university_id { get; set; }

    }
}
