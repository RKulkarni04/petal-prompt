const submitBtn = document.getElementById("submitBtn");
const questionInput = document.getElementById("questionInput");
const statusMessage = document.getElementById("statusMessage");

submitBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();

  if (!question) {
    statusMessage.textContent = "Please enter a question.";
    return;
  }

  statusMessage.textContent = "Loading responses from GPT and Ollama...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      statusMessage.textContent = data.error || "Something went wrong.";
      return;
    }

    localStorage.setItem("llmResults", JSON.stringify(data));
    window.location.href = "/results";
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Server error. Please try again.";
  }
});