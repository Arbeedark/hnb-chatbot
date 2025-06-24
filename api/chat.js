import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // 1) CORS headers – adjust '*' to a tighter origin if you like
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 2) Only POST calls allowed
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).send("Only POST allowed");
  }

  // 3) Read the chat history from the client
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages payload" });
  }

  try {
    // 4) Call GPT-4o
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });
    const msg = completion.choices[0].message;
    return res.status(200).json(msg);
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "OpenAI API error" });
  }
}
