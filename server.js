import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const { question } = req.body;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173", // can be anything for local
        "X-Title": "AI Finance Tracker"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",   // free model
        messages: [
          {
            role: "system",
            content: "You are a helpful finance assistant that gives short, practical money and budgeting advice."
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 200
      })
    });

    const data = await aiRes.json();

    if (data.choices && data.choices.length > 0) {
      const text = data.choices[0].message.content;
      res.json({ answer: text });
    } else {
      res.json({ answer: "No response from AI." });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "AI request failed" });
  }
});

app.listen(5000, () => console.log("AI server running on http://localhost:5000"));
