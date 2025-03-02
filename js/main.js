// Fetch and display user profile
// Fetch and display user profile from localStorage
function fetchProfile() {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!userId || !username || !email) {
        window.location.href = "login.html"; // Redirect to login if user data is missing
        return;
    }

    // Display user profile
    document.getElementById("username").textContent = username;
    document.getElementById("email").textContent = email;
}

// Submit a new question
async function submitQuestion() {
    const questionTitle = document.getElementById("questionTitle").value.trim();
    const message = document.getElementById("message");

    if (!questionTitle) {
        message.textContent = "Please enter a question!";
        return;
    }

    const userId = localStorage.getItem("user_id");

    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/submit-question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: userId,
                title: questionTitle
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Question submitted successfully!";
            document.getElementById("questionTitle").value = ""; // Clear input
            loadQuestions(); // Refresh questions list
        } else {
            message.style.color = "red";
            message.textContent = "Error: " + (data.message || "Failed to submit question.");
        }
    } catch (error) {
        message.textContent = "Error submitting question. Please try again.";
    }
}

// Fetch and display questions
async function loadQuestions() {
    const container = document.getElementById("questionsContainer");
    container.innerHTML = "<p>Loading questions...</p>";

    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/fetch-questions");
        const data = await response.json();

        if (response.ok) {
            container.innerHTML = "";
            data.questions.forEach(question => {
                const card = document.createElement("div");
                card.className = "question-card";
                card.innerHTML = `
                    <h3>${question.title}</h3>
                    <p><b style="color: blue;">Posted by: ${question.username || "Anonymous"}</b></p>
                    <small>Date: ${new Date(question.createdTime).toLocaleString()}</small>

                `;

                // Make the question card clickable
                card.addEventListener("click", () => {
                    window.location.href = `answers.html?questionID=${question.questionID}`;
                });

                container.appendChild(card);
            });
        } else {
            container.innerHTML = "<p>Error fetching questions.</p>";
        }
    } catch (error) {
        container.innerHTML = "<p>Failed to load questions.</p>";
    }
}

// Logout
document.getElementById("logout-link").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

// Load profile and questions when the page loads
fetchProfile();
loadQuestions();
