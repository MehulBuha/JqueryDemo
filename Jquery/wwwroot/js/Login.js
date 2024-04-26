function Validation() {
    var isValid = true;

    if ($("#email").val() === "") {
        $("#emailError").text("Email is required");
        isValid = false;
    } else {
        $("#emailError").text("");
    }

    if ($("#password").val() === "") {
        $("#passwordError").text("Password is required");
        isValid = false;
    } else {
        $("#passwordError").text("");
    }

    return isValid;
}

//$(document).ready(function () {
//    $("#loginForm").submit(function (e) {
//        e.preventDefault();

//        if (Validation()) {
//            var email = $("#email").val();
//            var password = $("#password").val();

//            $.ajax({
//                type: 'POST',
//                url: '/Login/Login',
//                data: { email: email, password: password },
//                success: function (response) {
//                    if (response === "Login successful") {
//                        $("#loginMessage").text("Login Successful.");

//                        //localstorage data set

//                        localStorage.setItem('email', email);
//                        localStorage.setItem('password', password);

//                        window.location.href = '/Employee/Index';
//                    } else {
//                        alert(xhr.responseText);
//                    }
//                },
//                error: function (xhr, textStatus, errorThrown) {
//                    alert(xhr.responseText);
//                }
//            });
//        }
//    });
//});



$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        if (Validation()) {
            var email = $("#email").val();
            var password = $("#password").val();

           

            showLoader();

            $.ajax({
                type: 'POST',
                url: '/Login/Login',
                data: { email: email, password: password },
                success: function (response) {
                    if (response === "Login successful") {
                        $("#loginMessage").text("Login Successful.");
                        toastr.success('Login Successful.', 'Success');

                        //localstorage data set
                        localStorage.setItem('email', email);
                        localStorage.setItem('password', password);

                        window.location.href = '/Employee/Index';
                    } else {
                        toastr.error(response, 'Error');
                        // Display specific error messages based on response
                        //if (response === "Invalid Email Or Password") {
                        //    $("#Error").text("Invalid email or password");

                        //} else if (response === "Invalid Email Address") {
                        //    $("#emailError").text("Invalid email address");
                        //    $("#passwordError").text("");
                        //} else if (response === "Invalid Password") {
                        //    $("#emailError").text("");
                        //    $("#passwordError").text("Invalid password.");
                        //}
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    toastr.error('Error occurred while logging in', 'Error');
                    // Display generic error message for any other errors
                    $("#emailError").text("Error occurred while logging in");
                    $("#passwordError").text("");
                },
              
                complete: function () {
                    // Hide loader after login attempt
                    hideLoader();
                }
            });
        }
    });
});


function showLoader() {
    // Show loader
    $('body').append('<div id="loader" style="position: relative; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.5); z-index: 9999; text-align: center;"><img src="/Images/loader.gif" alt="Loading..." style="height:25%"></div>');
}

function hideLoader() {
    // Hide loader
    $('#loader').remove();
}