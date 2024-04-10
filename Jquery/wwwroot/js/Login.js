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

$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        e.preventDefault();

        if (Validation()) {
            var email = $("#email").val();
            var password = $("#password").val();

            $.ajax({
                type: 'POST',
                url: '/Login/Login',
                data: { email: email, password: password },
                success: function (response) {
                    if (response === "Login successful") {
                        $("#loginMessage").text("Login Successful.");

                        //localstorage data set

                        localStorage.setItem('email', email);
                        localStorage.setItem('password', password);

                        window.location.href = '/Employee/Index';
                    } else {
                        alert(xhr.responseText);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    alert(xhr.responseText);
                }
            });
        }
    });
});


