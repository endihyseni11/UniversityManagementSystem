﻿using System.ComponentModel.DataAnnotations;

namespace UniversityManagementSystem.DTO
{
    public class RegisterDto
    {
        public string? UserName { get; set; }//qetu u kan UserName
        public string? name { get; set; }
        public string? surname { get; set; }
        
        public string? Password { get; set; }
        public string? Role { get; set; }
       

    }
}
