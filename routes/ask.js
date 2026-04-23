const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const db = require("../db");

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function askGPT(question) {
  if (!openai) {
    throw new Error("OpenAI API key not added yet.");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: question }
    ],
    max_tokens: 200
  });

  return response.choices[0].message.content;
}

async function askOllama(question) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gemma3:1b",
      prompt: question,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error("Failed to get response from Ollama");
  }

  const data = await response.json();
  return data.response;
}

router.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const results = await Promise.allSettled([
      askGPT(question),
      askOllama(question)
    ]);

    const gptAnswer =
      results[0].status === "fulfilled"
        ? results[0].value
        : "GPT response unavailable right now.";

    const ollamaAnswer =
      results[1].status === "fulfilled"
        ? results[1].value
        : "Ollama response unavailable right now.";

    db.run(
      `INSERT INTO questions (question_text) VALUES (?)`,
      [question],
      function (err) {
        if (err) {
          console.error("Failed to save question:", err.message);
          return res.json({
            question,
            gpt: gptAnswer,
            ollama: ollamaAnswer
          });
        }

        const questionId = this.lastID;

        db.run(
          `INSERT INTO responses (question_id, model_name, response_text) VALUES (?, ?, ?)`,
          [questionId, "GPT", gptAnswer]
        );

        db.run(
          `INSERT INTO responses (question_id, model_name, response_text) VALUES (?, ?, ?)`,
          [questionId, "Ollama", ollamaAnswer]
        );

        return res.json({
          question,
          gpt: gptAnswer,
          ollama: ollamaAnswer
        });
      }
    );
  } catch (error) {
    console.error("API error:", error.message);
    res.status(500).json({ error: "Failed to fetch responses from models." });
  }
});

module.exports = router;

module.exports = router;