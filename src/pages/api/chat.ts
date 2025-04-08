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
    const filePath = path.join(process.cwd(), "public", fileName);
    console.log("File path:", filePath);
    let kundaliFileData = "";
    if (!fs.existsSync(filePath)) {
        kundaliFileData = kundaliData?.kundaliData || "";
    }else{
        kundaliFileData = fs.readFileSync(filePath, "utf-8");
    }

    const prompt = `
You are a wise spiritual astrologer deeply trained in Vedic astrology.
Using the following Kundali data (in JSON format), answer the user's question.

Kundali Data:
${kundaliFileData}

User's Question:
${userMessage}
`;
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
