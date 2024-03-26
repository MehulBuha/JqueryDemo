using Jquery.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Jquery.Controllers
{
    public class EmployeeController : Controller
    {

        private readonly EmployeeDbContext _dbContext;
        public EmployeeController(EmployeeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IActionResult Index()
        {
            return View();
        }
        //public JsonResult EmployeeList(DateTime? fromDate = null, DateTime? toDate = null)
        //{

        //    List<Employee> employees = _dbContext.Employees.FromSqlRaw("EXEC GetEmployees @fromDate, @toDate",
        //         new SqlParameter("@fromDate", fromDate ?? (object)DBNull.Value),
        //         new SqlParameter("@toDate", toDate ?? (object)DBNull.Value)).ToList();

        //    return Json(employees);
        //}
        public JsonResult EmployeeList(DateTime? fromDate = null, DateTime? toDate = null, int pageNumber = 1, int pageSize = 10, string sortColumn = "CreationDate", string sortDirection = "DESC", string searchTerm = null)
        {
            List<Employee> employees = _dbContext.Employees
                .FromSqlRaw("EXEC GetEmployees @fromDate, @toDate, @pageSize, @pageNumber, @sortColumn, @sortDirection, @searchTerm",
                    new SqlParameter("@fromDate", fromDate ?? (object)DBNull.Value),
                    new SqlParameter("@toDate", toDate ?? (object)DBNull.Value),
                    new SqlParameter("@pageSize", pageSize),
                    new SqlParameter("@pageNumber", pageNumber),
                    new SqlParameter("@sortColumn", sortColumn),
                    new SqlParameter("@sortDirection", sortDirection),
                    new SqlParameter("@searchTerm", searchTerm ?? (object)DBNull.Value))
                .ToList();

            return Json(employees);
        }

        [HttpPost]
        public async Task<IActionResult> InsertEmployee(Employee employee)
        {
            try
            {
                await _dbContext.InsertEmployeeAsync(employee);
                return new JsonResult("Data Saved");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred while saving data.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> EditEmployee(int id)
        {
            try
            {
                Employee employee = await _dbContext.GetEmployeeByIdAsync(id);
                if (employee != null)
                    return new JsonResult(employee);
                else
                    return BadRequest("Employee not found");
            }
            catch (Exception ex)
            {

                return BadRequest("Error occurred while fetching employee data.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateEmployee(Employee employee)
        {
            try
            {
                await _dbContext.UpdateEmployeeAsync(employee);
                return new JsonResult("Data Updated");
            }
            catch (Exception ex)
            {
                return BadRequest("Error occurred while updating data.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var result = await _dbContext.DeleteEmployeeAsync(id);
                if (result)
                {
                    return Json(new { success = true, message = "Employee deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to delete employee" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while deleting employee" });
            }
        }

    }
}


