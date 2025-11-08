import { promises as fs } from "fs";
import path from "path";

const feedbackPath = path.join("/tmp", "feedback.json");

export async function handler(event) {
  try {
    if (event.httpMethod === "GET") {
      try {
        const data = await fs.readFile(feedbackPath, "utf8");
        const feedbacks = JSON.parse(data);
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbacks),
        };
      } catch {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        };
      }
    }

    if (event.httpMethod === "POST") {
      const { name, message } = JSON.parse(event.body || "{}");
      if (!message || message.length < 3) {
        return { statusCode: 400, body: "Ungültige Nachricht." };
      }

      const timestamp = new Date().toISOString();
      let feedbacks = [];

      try {
        const data = await fs.readFile(feedbackPath, "utf8");
        feedbacks = JSON.parse(data);
      } catch {
        feedbacks = [];
      }

      feedbacks.push({ name, message, timestamp });
      await fs.writeFile(feedbackPath, JSON.stringify(feedbacks, null, 2), "utf8");

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    console.error("Serverfehler:", err);
    return { statusCode: 500, body: "Serverfehler" };
  }
}
