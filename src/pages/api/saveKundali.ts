import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import tzlookup from "tz-lookup";

const BASE_URL = "https://json.apiastro.com";
const API_KEY = process.env.FREE_ASTROLOGY_API_KEY!;

const getTimezoneOffset = (
  lat: number,
  lon: number,
  dateTime: string
): number => {
  const tz = tzlookup(lat, lon); // Get IANA timezone string
  const offsetMinutes = moment.tz(dateTime, tz).utcOffset(); // Offset in minutes
  return offsetMinutes / 60; // Convert to float
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Received request to save Kundali data");
  console.log("Request body:", req.body);

  const {
    name,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    latitude,
    longitude,
    timezone,
  } = req.body;

  if (
    !name ||
    !dateOfBirth ||
    !timeOfBirth ||
    !placeOfBirth ||
    !latitude ||
    !longitude
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const [hour, minute] = timeOfBirth.split(":").map(Number);

  const dateTimeISO = `${dateOfBirth}T${timeOfBirth}:00`;
  const numericTimezone = getTimezoneOffset(latitude, longitude, dateTimeISO);

  const requestBody = {
    year,
    month,
    date: day,
    hours: hour,
    minutes: minute,
    seconds: 0,
    latitude,
    longitude,
    timezone: numericTimezone,
    observation_point: "topocentric",
    ayanamsha: "lahiri",
    language: "en",
  };

  const endpoints = [
    { key: "planetsExtended", path: "planets/extended" },
    {
      key: "mahadashaAntardasha",
      path: "vimsottari/maha-dasas-and-antar-dasas",
    },
  ];

  const kundaliData: Record<string, any> = {};

  try {
    for (const { key, path } of endpoints) {
      const response = await fetch(`${BASE_URL}/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`Fetching ${key}: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const text = await response.text();
        console.error(`Error fetching ${key}:`, text);
        throw new Error(`Failed to fetch ${key}: ${text}`);
      }

      const data = await response.json();
      kundaliData[key] = data;
    }

    // Prepare full object with metadata + data
    const completeKundali = {
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude,
      longitude,
      timezone: numericTimezone,
      generatedAt: new Date().toISOString(),
      data: kundaliData,
    };

    // Save to JSON file
    const filePath = path.join(
      process.cwd(),
      "temp",
      `${name.replace(/\s+/g, "_")}_kundali.json`
    );
    fs.writeFileSync(filePath, JSON.stringify(completeKundali, null, 2));

    return res.status(200).json({
      message: "Kundali fetched and saved successfully",
      filePath: `/temp/${name.replace(/\s+/g, "_")}_kundali.json`,
      kundaliData: completeKundali,
    });
  } catch (error: any) {
    console.error("Error fetching kundali data:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch kundali data" });
  }
}