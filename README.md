 Petal Prompt

Petal Prompt is a web application that allows users to ask a single question and receive responses from multiple Large Language Models (LLMs), specifically OpenAI GPT and a locally hosted Ollama model. The application enables easy comparison between cloud-based and local AI responses.

---

Features

- Submit a question through a simple UI
- Receive responses from:
  - OpenAI GPT (cloud-based)
  - Ollama (local model)
- View results side-by-side
- Input validation for empty questions
- Persistent storage using SQLite
- Unit testing with Jasmine
- Acceptance testing with Cucumber.js and Puppeteer

---

Tech Stack

- **Frontend:** HTML, CSS (custom pastel UI), JavaScript
- **Backend:** Node.js, Express
- **Database:** SQLite
- **AI Models:**
  - OpenAI GPT API
  - Ollama (local model)
- **Testing:**
  - Jasmine (unit tests)
  - Cucumber.js + Puppeteer (acceptance tests)

---

Installation

```bash
git clone https://github.com/RKulkarni04/petal-prompt.git
cd petal-prompt
npm install
