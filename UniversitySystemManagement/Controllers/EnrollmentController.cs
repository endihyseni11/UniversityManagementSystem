using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using UniversityManagementSystem.Models;

namespace UniversityManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        private readonly DataContext _context;

        public EnrollmentsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Enrollments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments()
        {
            return await _context.Enrollment.ToListAsync();
        }

        [HttpGet("GetEnrollmentsForCurrentUser")]
        [Authorize] // Assuming you're using some form of authentication
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollmentsForCurrentUser()
        {
            // Retrieve the user ID from the authentication token or claims
            var userId = int.Parse(User.FindFirst(ClaimTypes.SerialNumber).Value);

            // Check if the user ID is available
            

            // Retrieve enrollments for the logged-in user
            var userEnrollments = await _context.Enrollment
                .Where(e => e.user_id == userId)
                .ToListAsync();

            return Ok(userEnrollments);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Enrollment>> GetEnrollment(int id)
        {
            var enrollment = await _context.Enrollment.FindAsync(id);

            if (enrollment == null)
            {
                return NotFound();
            }

            return enrollment;
        }


        // POST: api/Enrollments
        // POST: api/Enrollments/{scheduleId}
        [HttpPost("{scheduleId}")]
        [Authorize]
        public async Task<ActionResult<Enrollment>> PostEnrollment(int scheduleId)
        {
            try
            {
                // Get the currently logged-in user's Id
                var userId = int.Parse(User.FindFirst(ClaimTypes.SerialNumber).Value);

                // Check if the user is already enrolled in the selected schedule
                var existingEnrollment = await _context.Enrollment
                    .FirstOrDefaultAsync(e => e.user_id == userId && e.schedule_id == scheduleId);

                if (existingEnrollment != null)
                {
                    // User is already enrolled, return an appropriate response
                    return BadRequest("User is already enrolled in this schedule.");
                }

                // Check if the schedule with the specified scheduleId exists
                var schedule = await _context.Schedule.FindAsync(scheduleId);
                if (schedule == null)
                {
                    return NotFound("Schedule not found.");
                }

                // Create a new Enrollment object
                var enrollment = new Enrollment
                {
                    user_id = userId,
                    schedule_id = scheduleId
                };

                // Add the enrollment to the context
                _context.Enrollment.Add(enrollment);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return the created enrollment
                return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.enrollment_id }, enrollment);
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }







        // PUT: api/Enrollments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnrollment(int id, Enrollment enrollment)
        {
            if (id != enrollment.enrollment_id)
            {
                return BadRequest();
            }

            _context.Entry(enrollment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnrollmentExists(id))
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

        // DELETE: api/Enrollments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var enrollment = await _context.Enrollment.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            _context.Enrollment.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnrollmentExists(int id)
        {
            return _context.Enrollment.Any(e => e.enrollment_id == id);
        }
        private bool EnrollmentExistsForSchedule(int scheduleId)
        {
            return _context.Enrollment.Any(e => e.schedule_id == scheduleId);
        }

        [HttpGet("HasEnrollmentForSchedule/{scheduleId}")]
        [Authorize]
        public async Task<ActionResult<bool>> HasEnrollmentForSchedule(int scheduleId)
        {
            try
            {
                // Retrieve the user ID from the authentication token or claims
                var userId = int.Parse(User.FindFirst(ClaimTypes.SerialNumber).Value);

                // Check if there is any enrollment for the given scheduleId and user
                var hasEnrollment = await _context.Enrollment
                    .AnyAsync(e => e.schedule_id == scheduleId && e.user_id == userId);

                return Ok(hasEnrollment);
            }
            catch (Exception ex)
            {
                // Handle exceptions appropriately
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



    }
}
