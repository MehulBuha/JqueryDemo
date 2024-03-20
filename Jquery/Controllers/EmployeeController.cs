using Jquery.Data;
using Jquery.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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

        private readonly string _connectionString;
        public EmployeeController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }


        public IActionResult Index()
        {
            return View();
        }

      

        public JsonResult EmployeeList(DateTime? fromDate = null, DateTime? toDate = null)
        {
            List<Employee> employees = new List<Employee>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetEmployees", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    if (fromDate.HasValue)
                        command.Parameters.AddWithValue("@fromDate", fromDate);
                   

                    if (toDate.HasValue)
                        command.Parameters.AddWithValue("@toDate", toDate);
                    

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Employee employee = new Employee
                            {
                                Id = (int)reader["Id"],
                                Name = reader["Name"].ToString(),
                                Gender = reader["Gender"].ToString(),
                                Email = reader["Email"].ToString(),
                                Password = reader["Password"].ToString(),
                                PhoneNo = reader["PhoneNo"].ToString(),
                                Address = reader["Address"].ToString(),
                                Occupation = reader["Occupation"].ToString(),
                                DateOfBirth = (DateTime)reader["DateOfBirth"],
                                CreationDate = (DateTime)reader["CreationDate"],
                                IsDeleted = (bool)reader["IsDeleted"]
                            };
                            employees.Add(employee);
                        }
                    }
                }
            }


            return Json(employees);
        }




        [HttpPost]
        public IActionResult InsertEmployee(Employee employee)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                bool emailExists;
                using (SqlCommand emailCheckCommand = new SqlCommand("CheckEmailExists", connection))
                {
                    emailCheckCommand.CommandType = CommandType.StoredProcedure;
                    emailCheckCommand.Parameters.AddWithValue("@Email", employee.Email);
                    emailCheckCommand.Parameters.AddWithValue("@Id", employee.Id); 
                    emailExists = (int)emailCheckCommand.ExecuteScalar() > 0;
                }
                if (emailExists)
                {
                   
                    return BadRequest("Email already exists.");
                }
                else {
                    using (SqlCommand command = new SqlCommand("InsertEmployee", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Name", employee.Name);
                        command.Parameters.AddWithValue("@Gender", employee.Gender);
                        command.Parameters.AddWithValue("@Email", employee.Email);
                        command.Parameters.AddWithValue("@Password", employee.Password);
                        command.Parameters.AddWithValue("@PhoneNo", employee.PhoneNo);
                        command.Parameters.AddWithValue("@Address", employee.Address);
                        command.Parameters.AddWithValue("@Occupation", employee.Occupation);
                        command.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth);
                        command.Parameters.AddWithValue("@CreationDate", DateTime.Now);
                        command.Parameters.AddWithValue("@IsDeleted", false);


                        command.ExecuteNonQuery();
                    }
                }
                connection.Close();
                return new JsonResult("Data Saved");
            }
            
        }
        [HttpGet]
        public IActionResult EditEmployee(int id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetEmployeeById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("EmployeeID", id);
                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    if (reader.Read())
                    {
                        Employee employee = new Employee
                        {
                            Name = reader["Name"].ToString(),
                            Gender = reader["Gender"].ToString(),
                            Email = reader["Email"].ToString(),
                            Password = reader["Password"].ToString(),
                            PhoneNo = reader["PhoneNo"].ToString(),
                            Address = reader["Address"].ToString(),
                            Occupation = reader["Occupation"].ToString(),
                            DateOfBirth = (DateTime)reader["DateOfBirth"]
                        };
                        return new JsonResult(employee);
                    }
                }
            }
            return BadRequest("Employee not found");
        }


        [HttpPost]
        public IActionResult UpdateEmployee(Employee employee)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            { 
                connection.Open();
                using (SqlCommand checkEmailCommand = new SqlCommand("CheckEmailExists", connection))
                {
                    checkEmailCommand.CommandType = CommandType.StoredProcedure;
                    checkEmailCommand.Parameters.AddWithValue("@Email", employee.Email);
                    checkEmailCommand.Parameters.AddWithValue("@Id", employee.Id);

                    int count = (int)checkEmailCommand.ExecuteScalar();

                    if (count > 0)
                    {         
                        return BadRequest("Email already exists for another employee.");
                    }
                }
                using (SqlCommand command = new SqlCommand("UpdateEmployee", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Id", employee.Id);
                    command.Parameters.AddWithValue("@Name", employee.Name);
                    command.Parameters.AddWithValue("@Gender", employee.Gender);
                    command.Parameters.AddWithValue("@Email", employee.Email);
                    command.Parameters.AddWithValue("@Password", employee.Password);
                    command.Parameters.AddWithValue("@PhoneNo", employee.PhoneNo);
                    command.Parameters.AddWithValue("@Address", employee.Address);
                    command.Parameters.AddWithValue("@Occupation", employee.Occupation);
                    command.Parameters.AddWithValue("@DateOfBirth", employee.DateOfBirth);
                    command.Parameters.AddWithValue("@IsDeleted", false);

                    command.ExecuteNonQuery();
                }
                return new JsonResult("Data Updated");
            }
        }

        [HttpPost]
        public IActionResult DeleteEmployee(int id)
         {
            using (SqlConnection connection = new SqlConnection(_connectionString))

            {
                using (SqlCommand command = new SqlCommand("DeleteEmployee", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@IsDeleted", true);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return new JsonResult("Data Updated");
            }
        }

    }
}


