using System.ComponentModel.DataAnnotations;

namespace UniversityManagementSystem.Models
{
    public class Enrollment
    {
        [Key]
        public int enrollment_id { get; set; }

        public int user_id { get; set; }

        public int schedule_id { get; set; }
    }
}

