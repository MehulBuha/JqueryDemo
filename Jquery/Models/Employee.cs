using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Jquery.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNo { get; set; }
        public string Address { get; set; }
        public string Occupation { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
