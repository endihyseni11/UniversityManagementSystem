using System.ComponentModel.DataAnnotations;

namespace UniversityManagementSystem.Models
{
    public class Faculty
    {
        [Key]
        public int faculty_id { get; set; }
        public string name { get; set; }
        public string office_location { get; set; }
        public string office_hours { get; set; }
        public string academic_rank { get; set; }
        public string research_interests { get; set; }
        public int department_id { get; set; }
    }
}
