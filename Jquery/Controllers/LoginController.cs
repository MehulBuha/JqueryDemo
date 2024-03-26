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
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> Login(string email, string password)
        {

            string status = await _dbContext.ValidateLogin(email, password);

            if (status == "Success")
            {
                return Json(new { success = true, message = "Login successful" });
            }
            else
            {
                return Json(new { success = false, message = "Invalid email or password" });
            }
        }
    }
}
