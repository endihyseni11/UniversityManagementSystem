using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using UniversityManagementSystem.Data; // Import your DbContext
using UniversityManagementSystem.Models;
using Microsoft.Extensions.Logging;


[Route("api/[controller]")]
[ApiController]
public class CourseController : ControllerBase
{
    private readonly DataContext _context;
    private readonly ILogger<CourseController> _logger;

    public CourseController(DataContext context, ILogger<CourseController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetAllCourses()
    {
        var courses = await _context.Course.ToListAsync();

        if (courses == null || !courses.Any())
        {
            return NotFound();
        }

        return courses;
    }


    // GET: api/Course/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var course = await _context.Course.FindAsync(id);

        if (course == null)
        {
            return NotFound();
        }

        return course;
    }

    // POST: api/Course
    [HttpPost]
    public async Task<ActionResult<Course>> PostCourse(Course course)
    {
        _context.Course.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCourse", new { id = course.course_id }, course);
    }

    // PUT: api/Course/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCourse(int id, Course course)
    {
        if (id != course.course_id)
        {
            return BadRequest();
        }

        _context.Entry(course).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CourseExists(id))
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

    // DELETE: api/Course/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Course.FindAsync(id);
        if (course == null)
        {
            return NotFound();
        }

        _context.Course.Remove(course);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CourseExists(int id)
    {
        return _context.Course.Any(e => e.course_id == id);
    }
}

