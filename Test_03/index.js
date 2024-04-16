// script.js
function showLoginForm(type) {
    const userLoginForm = document.getElementById('userLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (type === 'user') {
        userLoginForm.style.display = 'block';
        adminLoginForm.style.display = 'none';
    } else if (type === 'admin') {
        userLoginForm.style.display = 'none';
        adminLoginForm.style.display = 'block';
    }
}

function userLogin() {
    // Implement user login logic here
    const username = document.getElementById('username').value;
    const usermail = document.getElementById('usermail').value;
    const userPassword = document.getElementById('userPassword').value;

    if(username.length != 0 && usermail.length !=0 && userPassword.length !=0){
        // Assuming you have a server endpoint to handle user registration
        fetch('/api/register-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                usermail: usermail,
                password: userPassword,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('User registered successfully:', data);
            window.location.href = "user.html";
            // Redirect user to user.html or perform other actions as needed
        })
        .catch(error => console.error('Error registering user:', error));
    }else{
        alert("Please Input Login Credentials.");
    }
}

function adminLogin() {
    // Implement admin login logic here
    const adminId = document.getElementById('adminId').value;
    const adminMail = document.getElementById('adminMail').value;
    const adminPassword = document.getElementById('adminPassword').value;

    // Assuming you have a server endpoint to handle admin login
    fetch('/api/login-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            adminId: adminId,
            adminMail: adminMail,
            password: adminPassword,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Admin login successful');
            // Redirect admin to admin.html or perform other actions as needed
            window.location.href = "admin.html";
        } else {
            console.error('Invalid admin credentials');
            alert("Invalid Login Credenntials.")
            // Handle invalid credentials (display message, redirect, etc.)
        }
    })
    .catch(error => console.error('Error logging in admin:', error));
}
