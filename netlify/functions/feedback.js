import { promises as fs } from "fs";
import path from "path";

// Feedback-Datei temporär speichern (Netlify Functions laufen serverless)
const feedbackPath = path.join("/tmp", "feedback.json");

export async function handler(event) {
  try {
    // --- GET: Feedback abrufen ---
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
        // Falls Datei noch nicht existiert → leeres Array zurückgeben
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        };
      }
    }

    // --- POST: Neues Feedback speichern ---
    if (event.httpMethod === "POST") {
      const { name, message } = JSON.parse(event.body || "{}");

      // einfache Validierung
      if (!message || message.length < 3) {
        return { statusCode: 400, body: "Ungültige Nachricht." };
      }

      const timestamp = new Date().toISOString();
      let feedbacks = [];

      // bestehende Feedbacks laden (wenn vorhanden)
      try {
        const data = await fs.readFile(feedbackPath, "utf8");
        feedbacks = JSON.parse(data);
      } catch {
        feedbacks = [];
      }

      // neues Feedback anhängen
      feedbacks.push({ name, message, timestamp });

      // Datei überschreiben
      await fs.writeFile(feedbackPath, JSON.stringify(feedbacks, null, 2), "utf8");

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    }

    // Andere HTTP-Methoden blockieren
    return { statusCode: 405, body: "Method Not Allowed" };

  } catch (err) {
    console.error("Serverfehler:", err);
    return { statusCode: 500, body: "Serverfehler" };
  }
}
