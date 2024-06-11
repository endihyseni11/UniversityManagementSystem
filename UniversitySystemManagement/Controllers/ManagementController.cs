using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniversityManagementSystem.Models;

namespace UniversityManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagementController : ControllerBase
    {
        private readonly DataContext _context; // Replace YourDbContext with your actual DbContext name

        public ManagementController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Management
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Management>>> GetManagement()
        {
            return await _context.Management.ToListAsync();
        }

        // GET: api/Management/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Management>> GetManagement(int id)
        {
            var management = await _context.Management.FindAsync(id);

            if (management == null)
            {
                return NotFound();
            }

            return management;
        }

        // POST: api/Management
        [HttpPost]
        public async Task<ActionResult<Management>> PostManagement(Management management)
        {
            try
            {
                await _context.Database.ExecuteSqlInterpolatedAsync($@"
            EXEC InsertUserIntoManagement 
                {management.user_id},    
                {management.position}, 
                {management.university_id}
        ");

                return CreatedAtAction(nameof(GetManagement), new { id = management.management_id }, management);
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log the error)
                return BadRequest("Error occurred while inserting user into Management role.");
            }
        }


        // PUT: api/Management/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutManagement(int id, Management management)
        {
            if (id != management.management_id)
            {
                return BadRequest();
            }

            _context.Entry(management).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManagementExists(id))
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

        // DELETE: api/Management/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManagement(int id)
        {
            var management = await _context.Management.FindAsync(id);
            if (management == null)
            {
                return NotFound();
            }

            _context.Management.Remove(management);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ManagementExists(int id)
        {
            return _context.Management.Any(e => e.management_id == id);
        }
    }
}
