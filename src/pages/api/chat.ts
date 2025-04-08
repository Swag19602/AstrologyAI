import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userMessage, kundaliData } = req.body;
    console.log("Received request to generate Gemini response");
    console.log("Request body:", req.body);
    
    const name = kundaliData.kundaliData.name;
  if (!userMessage || !name) {
    console.error("Missing userMessage or kundaliData");
    return res.status(400).json({ message: "Missing userMessage or name" });
  }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ message: "Gemini API key not set" });
    }

  try {
    const fileName = `${name.trim().replace(/\s+/g, "_")}_kundali.json`
    const filePath = path.join("/tmp/", fileName);
    console.log("File path:", filePath);
    let kundaliFileData = "";
    if (!fs.existsSync(filePath)) {
        kundaliFileData = kundaliData?.kundaliData || "";
    }else{
        kundaliFileData = fs.readFileSync(filePath, "utf-8");
    }
    const prompt = promptGeneration(kundaliFileData, userMessage);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    if (!text) {
      console.error("Gemini response is empty");
      return res.status(500).json({ message: "Gemini response is empty" });
    }
    return res.status(200).json({ reply: text });
  } catch (err: any) {
    console.error("Gemini error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

interface PromptGenerationInput {
  kundaliFileData: string;
  userMessage: string;
}

const promptGeneration = (kundaliFileData: PromptGenerationInput["kundaliFileData"], userMessage: PromptGenerationInput["userMessage"]): string => {
  const prompt = `
You are a revered Vedic astrologer with decades of experience, deeply grounded in the principles of Jyotish Shastra, Nakshatra analysis, and Dasha interpretations. You combine spiritual wisdom with analytical precision.

Your goal is to provide insightful, personalized, and accurate astrological guidance based on the user's unique Kundali. Interpret planetary alignments, yogas, doshas, dashas, and house placements in context.

Respond in a tone that is empathetic, wise, and easy to understand — as if you’re guiding someone on a transformative life journey.

---

📜 **Kundali Data (JSON Format)**:
${kundaliFileData}

---

🧘‍♂️ **Guidelines for Interpretation**:
1. Analyze **planetary placements** in Rashi and Bhava.
2. Identify and explain relevant **Yogas**, **Doshas**, and **Raj Yogas**.
3. Decode the current **Mahadasha / Antardasha** and their psychological and material effects.
4. Provide actionable guidance rooted in **Vedic tradition** (career, marriage, health, spiritual growth).
5. Use simple language for clarity, but maintain spiritual depth.
6. Avoid repeating the input; focus on meaningful analysis and personalized insight.

---

🧠 **User's Question**:
${userMessage}

---

🎯 **Your Role**: Provide a detailed, compassionate, and spiritually attuned response. Support your answers with logical astrological reasoning from the Kundali data.
`;
  return prompt;
};