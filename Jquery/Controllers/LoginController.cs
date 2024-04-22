using Jquery.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jquery.Controllers
{
    public class LoginController : Controller
    {
        private readonly EmployeeDbContext _dbContext;

        public LoginController(EmployeeDbContext dbContext)
        {
            _dbContext = dbContext;
        }
                                        
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            try
            {
                var isAuthenticated = await _dbContext.ValidateLogin(email, password);
                if (isAuthenticated)
                {
                    return Ok("Login successful");
                }
                else
                {
                    return Ok("Invalid Email Or Password");
                }

            }
            catch
            {
                return StatusCode(500);
            }
        }



    }
}
