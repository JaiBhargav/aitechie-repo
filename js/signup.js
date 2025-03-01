// signup.js
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "Signup successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            throw new Error(data.message || "Signup failed");
        }
    } catch (error) {
        console.error("Error:", error);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Error: " + error.message;
    }
});