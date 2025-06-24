import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Only POST allowed");
  }
  const { messages } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });
    res.status(200).json(response.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
