
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/userlogin-lambda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.user_id) {
            // Store user details in localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("email", data.email);
	    localStorage.setItem("username",data.username);

            // Redirect to main page
            window.location.href = "main.html";
        } else {
            errorMessage.textContent = data.message || "Invalid login credentials. Please try again.";
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.textContent = "Failed to log in. Please check your internet connection and try again.";
    }
});
