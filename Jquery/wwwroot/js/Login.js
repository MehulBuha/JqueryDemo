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

            // Start the loading bar
            NProgress.start();

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
                    // Stop the loading bar
                    NProgress.done();
                }
            });
        }
    });
});
