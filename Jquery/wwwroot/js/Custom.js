//Validation

function Validation() {
    var isValid = true;

    if ($("#Name").val() === "") {
        $("#nameError").text("Name is required");
        isValid = false;
    } else if ($("#Name").val().length > 100) {
        $("#nameError").text("Name must be at most 100 characters long");
        isValid = false;
    } else {
        $("#nameError").text("");
    }

    if (!$("input[name='Gender']:checked").val()) {
        $("#genderError").text("Gender is required");
        isValid = false;
    } else {
        $("#genderError").text("");
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ($("#Email").val() === "") {
        $("#emailError").text("Email is required");
        isValid = false;
    } else if (!emailRegex.test($("#Email").val())) {
        $("#emailError").text("Please enter a valid email address");
        isValid = false;
    } else {
        $("#emailError").text("");
    }

    var passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/><,.\|])(?=.*[0-9a-z]).{8,}$/;
    if ($("#Password").val() === "") {
        $("#passwordError").text("Password is required");
        isValid = false;
    }
    else if (!passwordRegex.test($("#Password").val())) {
        $("#passwordError").text("Password must contain at least 8 characters including 1 uppercase letter, 1 special character, and alphanumeric characters");
        isValid = false;
    }
    else {
        $("#passwordError").text("");
    }

    if ($("#Phone").val() === "") {
        $("#phoneError").text("Phone is required");
        isValid = false;
    }
    else if ($("#Phone").val().length > 15)
    {
        $("#phoneError").text("PhoneNo must be at most 15 characters long");
        isValid = false;
    }
    else
    {
        $("#phoneError").text("");
    }

    if ($("#Address").val().length > 200) {
        $("#AddressError").text("Address must be at most 200 characters long");
        isValid = false;
    }
    else {
        $("#AddressError").text("");
    }
    if ($("#Occupation").val().length > 200) {
        $("#OccupationError").text("Occupation must be at most 100 characters long");
        isValid = false;
    }
    else {
        $("#OccupationError").text("");
    }
    if ($("#DateofBirth").val() === "") {
        $("#DateofBirthError").text("Date of Birth is required");
        isValid = false;
    } else {
        $("#DateofBirthError").text("");
    }

    return isValid;
}

var currentPage = 1;
var pageSize = 10;
var sortColumn = 'CreationDate'; // Default sort column
var sortDirection = 'DESC'; // Default sort direction

$(document).ready(function () {

    //Local storage data get
    var loggedInEmail = localStorage.getItem('email');
    var loggedInPassword = localStorage.getItem('password');

    if (loggedInEmail && loggedInPassword)
    {
        $("#loggedInUser").text(loggedInEmail);
    }
    else
    {
        window.location.href = '/Login';
    }



    // Event handler for sorting columns
    $(".sortable-column").click(function () {
        var column = $(this).data('column');
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            sortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
        } else {
            // If a new column is clicked, set it as the sorting column and default to descending order
            sortColumn = column;
            sortDirection = 'DESC';
        }
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();
        var searchTerm = $("#searchTerm").val(); // Get the search term
        ShowEmployeeData(fromDate, toDate, currentPage, pageSize, sortColumn, sortDirection, searchTerm);
    });

    // Event handler for Previous button
    $("#btnPrevious").click(function () {
        if (currentPage > 1) {
            currentPage--;
            var fromDate = $("#fromDate").val();
            var toDate = $("#toDate").val();
            var searchTerm = $("#searchTerm").val(); // Get the search term
            ShowEmployeeData(fromDate, toDate, currentPage, pageSize, sortColumn, sortDirection, searchTerm);
        }
    });

    // Event handler for Next button
    $("#btnNext").click(function () {
        currentPage++;
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();
        var searchTerm = $("#searchTerm").val(); // Get the search term
        ShowEmployeeData(fromDate, toDate, currentPage, pageSize, sortColumn, sortDirection, searchTerm);
    });

    // Event handler for page size change
    $("#pageSize").change(function () {
        pageSize = $(this).val();
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();
        currentPage = 1; // Reset current page to 1 when page size changes
        var searchTerm = $("#searchTerm").val(); // Get the search term
        ShowEmployeeData(fromDate, toDate, currentPage, pageSize, sortColumn, sortDirection, searchTerm);
    });

    // Event handler for Filter button
    $("#btnFilter").click(function () {
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();
        var searchTerm = $("#searchTerm").val(); // Get the search term
        ShowEmployeeData(fromDate, toDate, currentPage, pageSize, sortColumn, sortDirection, searchTerm);
    });

    // Initial loading of data without any filters
    ShowEmployeeData();
});


//Get Data
function ShowEmployeeData(fromDate, toDate, pageNumber, pageSize, sortColumn, sortDirection, searchTerm) {

    $.ajax({
        url: baseUrl + '/Employee/list',
        type: 'GET',
        data: {
            fromDate: fromDate,
            toDate: toDate,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortColumn: sortColumn,
            sortDirection: sortDirection,
            searchTerm: searchTerm
         },
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
            debugger;
            var object = '';
            $.each(result, function (index, item) {
                object += '<tr>';
                object += '<td>' + item.name + '</td>';
                object += '<td>' + item.gender + '</td>';
                object += '<td>' + item.email + '</td>';
                object += '<td>' + item.password + '</td>';
                object += '<td>' + item.phoneNo + '</td>';
                object += '<td>' + item.address + '</td>';
                object += '<td>' + item.occupation + '</td>';
                object += '<td>' + new Date(item.dateOfBirth).toLocaleDateString() + '</td>';
                object += '<td>' + new Date(item.creationDate).toLocaleDateString() + '</td>';
                if (item.images == null)
                {
                    object += '<td><img src="https://localhost:44312/Images/noimage.jpg" alt="Employee Image" style="max-width: 100px; max-height: 100px;"></td>';
                }
                else
                {
                    object += '<td><img src="https://localhost:44312/Images/' + item.images + '" alt="Employee Image" style="max-width: 100px; max-height: 100px;"></td>';
                }
                object += '<td><a href="#"  class="btn btn-primary" onclick="EditEmployee(' + item.id + ')" >Edit</a>  <a href="#" class="btn btn-danger" onclick="DeleteEmployee(' + item.id + ')">Delete</a></td>';

                object += '</tr>';

            });
            $("#tbl_data").html(object);

            updatePaginationControls(pageNumber);
            debugger
            var storedEmail = localStorage.getItem('email');
            var storedPassword = localStorage.getItem('password');
            console.log("Get Email from local storage: " + storedEmail);
            console.log("Get Password from local storage: " + storedPassword);
           
               

        },
        error: function () {
            alert("data not found");
        }
    });
};
function updatePaginationControls(pageNumber) {
    // Enable/disable Previous button based on current page
    if (pageNumber > 1) {
        $("#btnPrevious").prop("disabled", false);
    } else {
        $("#btnPrevious").prop("disabled", true);
    }

    // Update current page number display
    $("#currentPage").text(pageNumber);
    $("#currentPageSize").text(pageSize);
}

//Open Modal Popup
$("#btnAddEmployee").click(function () {
    $("#EmployeeModal").modal('show');
    ClearTextBox();
    $("#AddEmployee").css('display', 'block');
    $("#UpdateEmployee").css('display', 'none');
    $("#EmployeeHeading").text('Add Employee')
});


//Insert Data
//function AddEmployee() {
//    if (Validation()) {
//        var data = $("#form").serialize();
//        $.ajax({
//            type: 'POST',
//            url: 'https://localhost:44312/Employee',
//            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//            data: data,
//            success: function (result) {
//                alert('Successfully Inserted Data ');
//                ClearTextBox();
//                ShowEmployeeData();
//                $("#EmployeeModal").modal('hide');
//            },
//            error: function () {
//                alert('Failed to receive the Data');
//                console.log('Failed ');
//            }
//        });
//    }
//}

//API
// Insert Data
//function AddEmployee() {
//    if (Validation()) {
//        var formData = $("#form").serializeArray();
//        var employeeData = {};
//        $(formData).each(function (index, obj) {
//            if (obj.name !== "Id") { // Exclude the 'Id' field
//                employeeData[obj.name] = obj.value;
//            }
//        });

//        $.ajax({
//            type: 'POST',
//            url: baseUrl + '/Employee/insert',
//            contentType: 'application/json',
//            data: JSON.stringify(employeeData),
//            success: function (result) {
//                alert('Successfully Inserted Data');
//                ClearTextBox();
//                ShowEmployeeData();
//                $("#EmployeeModal").modal('hide');
//            },
//            error: function (xhr, textStatus, errorThrown) {
//                alert('Failed to receive the Data');
//                console.log('Failed: ' + xhr.responseText);
//            }
//        });
//    }
//}


function AddEmployee() {
    if (Validation()) {
        var formData = new FormData(); // Create FormData object to handle file uploads
        // Append employee data fields
        formData.append("Name", $("#Name").val());
        formData.append("Gender", $("input[name='Gender']:checked").val());
        formData.append("Email", $("#Email").val());
        formData.append("Password", $("#Password").val());
        formData.append("PhoneNo", $("#Phone").val());
        formData.append("Address", $("#Address").val());
        formData.append("Occupation", $("#Occupation").val());
        formData.append("DateOfBirth", $("#DateofBirth").val());
       
        // Append image file
        var imageFile = $('#Image')[0].files[0];
        if (imageFile) {
            formData.append("Image", imageFile);
        }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        $.ajax({
            type: 'POST',
            url: baseUrl + '/Employee/insert',
            contentType: false, // Set contentType to false when sending FormData
            processData: false, // Set processData to false to prevent jQuery from automatically converting FormData to string
            data: formData,
            success: function (result) {
                toastr.success('Data Successfully Inserted');
                ClearTextBox();
                ShowEmployeeData();
                $("#EmployeeModal").modal('hide');
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Failed to receive the Data');
                console.log('Failed: ' + xhr.responseText);
            }
        });
    }
}

//Clear TextBox
function ClearTextBox() {
    $("#Id").val('');
    $("#Name").val('');
    $("input[name='Gender']").prop('checked', false);
    $('#Email').val('');
    $('#Password').val('');
    $('#Phone').val('');
    $("#Address").val('');
    $("#Occupation").val('');
    $("#DateofBirth").val('');
    $("#Image").val('');
}


//Future Date Disbable
$(document).ready(function () {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('DateofBirth').setAttribute('max', today);
})

//Edit data
//function EditEmployee(id) {
//    $.ajax({
//        url: '/Employee/EditEmployee?id=' + id,
//        type: 'GET',
//        contentType: 'application/json',
//        dataType: 'json',
//        success: function (result) {

//            $("#EmployeeModal").modal('show');
//            $("#Id").val(id);
//            $("#Name").val(result.name);
//            $("input[name='Gender'][value='" + result.gender + "']").prop('checked', true);
//            $("#Email").val(result.email);
//            $("#Password").val(result.password);
//            $("#Phone").val(result.phoneNo);
//            $("#Address").val(result.address);
//            $("#Occupation").val(result.occupation);
//            $("#DateofBirth").val(result.dateOfBirth.substring(0, 10));
//            $("#AddEmployee").css('display', 'none');
//            $("#UpdateEmployee").css('display', 'block');
//            $("#EmployeeHeading").text('Update Employee')

//        },
//        error: function () {
//            alert('Failed to fetch employee data');
//        }
//    });
//}

//API
//Edit data
function EditEmployee(id) {
    $.ajax({
        url: baseUrl + '/Employee/edit/' + id,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
            debugger
            $("#EmployeeModal").modal('show');
            $("#Id").val(id);
            $("#Name").val(result.data.name);
            $("input[name='Gender'][value='" + result.data.gender + "']").prop('checked', true);
            $("#Email").val(result.data.email);
            $("#Password").val(result.data.password);
            $("#Phone").val(result.data.phoneNo);
            $("#Address").val(result.data.address);
            $("#Occupation").val(result.data.occupation);
            $("#DateofBirth").val(result.data.dateOfBirth);
           
            $("#AddEmployee").css('display', 'none');
            $("#UpdateEmployee").css('display', 'block');
            $("#EmployeeHeading").text('Update Employee')

        },
        error: function () {
            alert('Failed to fetch employee data');
        }
    });
}


// Update Data
//function UpdateEmployee() {
//    if (Validation()) {
//        var data = $("#form").serialize();
//        $.ajax({
//            type: 'POST',
//            url: '/Employee/UpdateEmployee',
//            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//            data: data,
//            success: function (result) {
//                alert('Successfully updated data');
//                ClearTextBox();
//                ShowEmployeeData();
//                $("#EmployeeModal").modal('hide');
//            },
//            error: function () {
//                alert('Failed to update data');
//                console.log('Failed to update data');
//            }
//        });
//    }
//}


//API
//Update Data

//function UpdateEmployee() {
//    if (Validation()) {
//        var formData = $("#form").serializeArray();
//        var employeeData = {};
//        $(formData).each(function (index, obj) {
//            if (obj.name !== "id") { 
//                employeeData[obj.name] = obj.value;
//            }
//        });
//        debugger;
//        $.ajax({
//            type: 'POST',
//            url: baseUrl + '/Employee/update',
//            contentType: 'application/json',
//            data: JSON.stringify(employeeData),
//            success: function (result) {
//                alert('Successfully Updated Data');
//                ClearTextBox();
//                ShowEmployeeData();
//                $("#EmployeeModal").modal('hide');
//            },
//            error: function (xhr, textStatus, errorThrown) {
//                alert('Failed to receive the Data');
//                console.log('Failed: ' + xhr.responseText);
//            }
//        });
//    }
//}

//update data

function UpdateEmployee() {
    if (Validation()) {
        var formData = new FormData(); // Create FormData object to handle data

        // Append form data fields
        formData.append("Name", $("#Name").val());
        formData.append("Gender", $("input[name='Gender']:checked").val());
        formData.append("Email", $("#Email").val());
        formData.append("Password", $("#Password").val());
        formData.append("PhoneNo", $("#Phone").val());
        formData.append("Address", $("#Address").val());
        formData.append("Occupation", $("#Occupation").val());
        formData.append("DateOfBirth", $("#DateofBirth").val());
        formData.append("CreationDate", new Date().toISOString());
  
        var imageFile = $('#Image')[0].files[0];
        if (imageFile) {
            formData.append("Image", imageFile);
        }

        // Retrieve employee ID from hidden input field
        var employeeId = $("#Id").val();
        formData.append("Id", employeeId); 

        $.ajax({
            type: 'POST',
            url: baseUrl + '/Employee/update',
            contentType: false, // Set contentType to false when sending FormData
            processData: false, // Set processData to false to prevent jQuery from automatically converting FormData to string
            data: formData,
            success: function (result) {
                toastr.success('Data Successfully Updated');
                ClearTextBox();
                ShowEmployeeData();
                $("#EmployeeModal").modal('hide');
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Failed to receive the Data');
                console.log('Failed: ' + xhr.responseText);
            }
        });
    }
}

//delete data

function DeleteEmployee(id) {
    var data = $("#form").serializeArray();
    if (confirm('Are you sure, You want to delete this record?')) {
        $.ajax({
            type: 'POST',
            url: baseUrl + '/Employee/delete/' + id,
            contentType: 'application/json',
            data: id,
            success: function (result) {
                ShowEmployeeData();

            },
            error: function () {
                alert('Failed to delete data');
                console.log('Failed to delete data');
            }
        });
    }
   
}

