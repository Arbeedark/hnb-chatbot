import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY    // ← Vercel ENV var
});

export default async function handler(req, res) {
  // ▶ CORS (allow embedding anywhere):
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).send("Only POST allowed");
  }

  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
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
