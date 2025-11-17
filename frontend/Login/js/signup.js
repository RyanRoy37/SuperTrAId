document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const rePasswordInput = document.getElementById('rePassword');
    const passwordMessage = document.getElementById('passwordMessage');
    const rePasswordMessage = document.getElementById('rePasswordMessage');
    const signupBtn = document.getElementById('signupBtn');

    function validatePassword(password) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return pattern.test(password);
    }

    function checkPasswords() {
        const password = passwordInput.value;
        const rePassword = rePasswordInput.value;

        if (password.length === 0) {
            passwordMessage.textContent = '';
            passwordMessage.className = 'validation-message';
        } else if (!validatePassword(password)) {
            passwordMessage.textContent = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
            passwordMessage.className = 'validation-message';
        } else {
            passwordMessage.textContent = 'Password looks good';
            passwordMessage.className = 'validation-success';
        }

        if (rePassword.length === 0) {
            rePasswordMessage.textContent = '';
            rePasswordMessage.className = 'validation-message';
        } else if (password !== rePassword) {
            rePasswordMessage.textContent = 'Passwords do not match';
            rePasswordMessage.className = 'validation-message';
        } else {
            rePasswordMessage.textContent = 'Passwords match';
            rePasswordMessage.className = 'validation-success';
        }

        signupBtn.disabled = !(validatePassword(password) && password === rePassword);
    }

    passwordInput.addEventListener('input', checkPasswords);
    rePasswordInput.addEventListener('input', checkPasswords);

    signupForm.addEventListener('submit', function (e) {
        e.preventDefault(); // stop normal form submission

        if (signupBtn.disabled) {
            alert('Please fix the errors in the form before submitting.');
            return;
        }

        // Collect all inputs into JSON
        const formData = {};
        const inputs = signupForm.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });

        // Send JSON to backend
        fetch("http://localhost/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Signup failed");
            }
            return res.json();
        })
        .then(data => {
            alert("Signup successful!");
            window.location.href = "login.html"; // 🔑 redirect
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Something went wrong, please try again.");
        });
    });
});
