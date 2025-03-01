const urlParams = new URLSearchParams(window.location.search);
const questionID = urlParams.get("questionID");

if (!questionID) {
    document.getElementById("message").textContent = "Invalid Question.";
} else {
    fetchQuestion(); // Fetch question and answers when the page loads
}

async function fetchQuestion() {
    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/fetch-questions");
        const data = await response.json();

        if (response.ok) {
            const question = data.questions.find(q => q.questionID === questionID);
            if (question) {
                document.getElementById("questionTitle").textContent = question.title;
                fetchAnswers();
            } else {
                document.getElementById("message").textContent = "Question not found.";
            }
        } else {
            document.getElementById("message").textContent = "Error fetching question.";
        }
    } catch (error) {
        document.getElementById("message").textContent = "Failed to fetch question.";
        console.error("Error fetching question:", error);
    }
}

async function fetchAnswers() {
    if (!questionID) {
        console.error("Question ID not found in URL");
        return;
    }

    try {
        const response = await fetch(`https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/fetch-answers?questionID=${questionID}`);
        const data = await response.json();

        console.log("Fetched answers:", data);

        if (response.ok && data.answers.length > 0) {
            const answersContainer = document.getElementById("answersContainer");
            answersContainer.innerHTML = "";

            data.answers.forEach(answer => {
                const answerElement = document.createElement("div");
                answerElement.classList.add("answer-item");

                answerElement.innerHTML = `
                    <p><strong>${answer.username || "Anonymous"}:</strong></p>
                    <p>${answer.answer}</p>
                    <small>${new Date(answer.createdAt).toLocaleString()}</small>
                `;

                answersContainer.appendChild(answerElement);
            });
        } else {
            document.getElementById("answersContainer").innerHTML = "<p>No answers yet.</p>";
        }
    } catch (error) {
        console.error("Failed to load answers:", error);
        document.getElementById("answersContainer").innerHTML = "<p>Failed to load answers.</p>";
    }
}

async function submitAnswer() {
    const answerText = document.getElementById("answerText").value.trim();
    const message = document.getElementById("message");

    if (!answerText) {
        message.textContent = "Please enter an answer!";
        return;
    }

    const userId = localStorage.getItem("user_id");

    if (!userId) {
        message.textContent = "You must be logged in to post an answer.";
        return;
    }

    try {
        const response = await fetch("https://8vocl29msb.execute-api.us-east-1.amazonaws.com/prod/submit-answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                questionID,
                userID: userId,
                answer: answerText
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        message.textContent = "Answer submitted successfully!";
	message.style.color = "green"; 
        document.getElementById("answerText").value = ""; // Clear input
        fetchAnswers(); // Refresh answers list
    } catch (error) {
        console.error("Error submitting answer:", error);
        message.textContent = "Failed to submit answer. Please try again.";
    }
}
