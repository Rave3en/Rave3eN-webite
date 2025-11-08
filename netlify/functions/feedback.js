import { promises as fs } from "fs";
import path from "path";

const feedbackPath = path.join("/tmp", "feedback.json");

// --- GitHub Konfiguration ---
const GITHUB_OWNER = "DEIN_GITHUB_NAME";       // <-- hier deinen GitHub-Namen eintragen
const GITHUB_REPO = "Rave3eN-website";         // <-- dein Repository-Name
const GITHUB_FILE = "feedback.json";           // Datei, in die gespeichert wird

// API Helper: Schreibe Datei in GitHub Repo
async function saveToGitHub(content) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("⚠️ Kein GitHub Token gefunden. Feedbacks werden nur temporär gespeichert.");
    return false;
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

  try {
    // Prüfen, ob Datei existiert (SHA für Update)
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
    });

    const json = await getRes.json();
    const sha = json.sha;

    // Neue Datei hochladen oder überschreiben
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: "💬 Neues Feedback hinzugefügt",
        content: Buffer.from(content).toString("base64"),
        sha,
      }),
    });

    const putJson = await putRes.json();
    return putJson.commit ? true : false;
  } catch (err) {
    console.error("❌ Fehler beim Speichern in GitHub:", err);
    return false;
  }
}

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
        // Wenn lokale Datei leer → GitHub laden
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_FILE}`);
          if (res.ok) {
            const json = await res.json();
            return {
              statusCode: 200,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(json),
            };
          }
        } catch {}
        return { statusCode: 200, body: JSON.stringify([]) };
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
        // oder GitHub lesen
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${GITHUB_FILE}`);
          if (res.ok) feedbacks = await res.json();
        } catch {
          feedbacks = [];
        }
      }

      feedbacks.push({ name, message, timestamp });

      const newContent = JSON.stringify(feedbacks, null, 2);
      await fs.writeFile(feedbackPath, newContent, "utf8");
      await saveToGitHub(newContent);

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
