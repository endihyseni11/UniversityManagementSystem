using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UniversityManagementSystem.Data;
using UniversityManagementSystem.Models;

namespace UniversityManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly DataContext _context;

        public TeachersController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            return await _context.Teacher.ToListAsync();
        }
        [HttpGet("teachers/{teacherId}")]
        public async Task<ActionResult<Users>> GetTeacherById(int teacherId)
        {
            var teacher = await _context.Users
                .Where(u => u.roleName == "Teacher" && u.user_id == teacherId)
                .FirstOrDefaultAsync();

            return Ok(teacher);
        }
        // GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
            var teacher = await _context.Teacher.FindAsync(id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher;
        }

        // POST: api/Teacher
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            try
            {
                await _context.Database.ExecuteSqlInterpolatedAsync($@"
            EXEC InsertUserIntoTeacher 
                {teacher.user_id}, 
                {teacher.department_id}, 
                {teacher.office_location}, 
                {teacher.office_hours}, 
                {teacher.academic_rank}, 
                {teacher.research_interests}
        ");

                return CreatedAtAction(nameof(GetTeachers), new { id = teacher.teacher_id }, teacher);
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log the error)
                return BadRequest("Error occurred while inserting user into Teacher role.");
            }
        }


        // PUT: api/Teachers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            if (id != teacher.teacher_id)
            {
                return BadRequest();
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teacher.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teacher.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherExists(int id)
        {
            return _context.Teacher.Any(e => e.teacher_id == id);
        }
    }
}

