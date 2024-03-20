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
    else if ($("#Phone").val().length > 15) {
        $("#phoneError").text("PhoneNo must be at most 15 characters long");
        isValid = false;
    }
    else {
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



$(document).ready(function () {

    ShowEmployeeData();
    $("#btnFilter").click(function () {
        var fromDate = $("#fromDate").val();
        var toDate = $("#toDate").val();
        ShowEmployeeData(fromDate, toDate);
    });
 
});



//Get Data
function ShowEmployeeData(fromDate, toDate) {
    debugger;
    $.ajax({
        url: '/Employee/EmployeeList',
        type: 'Get',
        data: {
            fromDate: fromDate,
            toDate: toDate
        },
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        success: function (result, status, xhr) {
          
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
                object += '<td><a href="#"  class="btn btn-primary" onclick="EditEmployee(' + item.id + ')" >Edit</a>||<a href="#" class="btn btn-danger" onclick="DeleteEmployee(' + item.id +')">Delete</a></td>';

                object += '</tr>';

            });
            $("#tbl_data").html(object);

          
            if (!$.fn.DataTable.isDataTable('#Datatable')) {
                var table = $('#Datatable').DataTable({
                    "columnDefs": [{
                        "targets": [9],
                        "orderable": false
                    }]

                });
            }

        },
        error: function () {
            alert("data not found");
        }
    });
};


//Open Modal Popup
$("#btnAddEmployee").click(function () {
    $("#EmployeeModal").modal('show');
    ClearTextBox();
    $("#AddEmployee").css('display', 'block');
    $("#UpdateEmployee").css('display', 'none');
    $("#EmployeeHeading").text('Add Employee')
});


//Insert Data
function AddEmployee() {
    if (Validation()) {
        var data = $("#form").serialize();
        $.ajax({
            type: 'POST',
            url: '/Employee/InsertEmployee',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {
                alert('Successfully Inserted Data ');
                ClearTextBox();
                ShowEmployeeData();
                $("#EmployeeModal").modal('hide');
            },
            error: function () {
                alert('Failed to receive the Data');
                console.log('Failed ');
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
}


//Future Date Disbable
$(document).ready(function () {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('DateofBirth').setAttribute('max', today);
})


//Edit data
function EditEmployee(id) {
    $.ajax({
        url: '/Employee/EditEmployee?id=' + id,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {

            $("#EmployeeModal").modal('show');
            $("#Id").val(id);
            $("#Name").val(result.name);
            $("input[name='Gender'][value='" + result.gender + "']").prop('checked', true);
            $("#Email").val(result.email);
            $("#Password").val(result.password);
            $("#Phone").val(result.phoneNo);
            $("#Address").val(result.address);
            $("#Occupation").val(result.occupation);
            $("#DateofBirth").val(result.dateOfBirth.substring(0, 10));
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
function UpdateEmployee() {
    if (Validation()) {
        var data = $("#form").serialize();
        $.ajax({
            type: 'POST',
            url: '/Employee/UpdateEmployee',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {
                alert('Successfully updated data');
                ClearTextBox();
                ShowEmployeeData();
                $("#EmployeeModal").modal('hide');
            },
            error: function () {
                alert('Failed to update data');
                console.log('Failed to update data');
            }
        });
    }
}

//Delete Data
function DeleteEmployee(id) {
    var data = $("#form").serialize();
    if (confirm('Are you sure, You want to delete this record?')) {
        $.ajax({
            type: 'POST',
            url: '/Employee/DeleteEmployee?id=' + id,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: id,
            success: function (result) {
                ShowEmployeeData();

            },
            error: function () {
                alert('Failed to update data');
                console.log('Failed to update data');
            }
        });
    }
   
}

