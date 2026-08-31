# Rave3eN Website

Fertige statische Website für GitHub Pages / rave3en.de.

## Enthalten
- Rave3eN Branding mit eigenem Logo
- Moderner, erwachsener Neon-Look in Lila / Blau / Schwarz
- Fest integrierter Twitch Player
- Twitch Chat ein-/ausklappbar
- Fest integrierte Spotify Playlist
- About Me / Events / Partner / Feedback
- Responsive Layout für Desktop, Tablet und Mobile
- Anonymes Feedback-Frontend

## 1. Direkt auf GitHub hochladen
Lade den gesamten Inhalt dieses Ordners in dein GitHub-Pages Repository.

Wichtig:
- `index.html`
- `styles.css`
- `app.js`
- Ordner `assets`

## 2. Twitch
In `app.js` ist aktuell eingetragen:

    twitchChannel: "rave3en"

Für Twitch Embeds ist die `parent`-Domain Pflicht. Bereits enthalten:
- rave3en.de
- www.rave3en.de
- aktuelle Browser-Domain

Wenn du auf einer anderen Domain testest/hostest, ergänze diese in `twitchParents`.

Hinweis zu Autoplay:
Browser dürfen Autoplay mit hörbarem Ton blockieren. Deshalb startet der Stream zunächst technisch sicher mit mute, danach versucht die Seite auf ca. 8 % Lautstärke umzuschalten. Falls der Browser das verhindert, erscheint im Player unten links ein kleiner Button „Leisen Stream-Sound aktivieren“.

## 3. Spotify
Playlist:
https://open.spotify.com/playlist/1RUL905g3PozmTWp8fAZCs

Spotify wird sichtbar eingebettet. Wegen Browser- und Spotify-Regeln wird Audio nicht ungefragt automatisch gestartet. Der Besucher startet die Wiedergabe selbst im eingebetteten Spotify-Player.

## 4. Privates anonymes Feedback
Eine reine GitHub-Pages-Seite hat keinen sicheren privaten Server und kann Feedback nicht vertraulich selbst speichern.

Deshalb ist das Formular vorbereitet, aber der Versand-Endpunkt muss einmal verbunden werden.

Einfachste Varianten:
- Formspree
- Basin
- eigene Serverless Function (Cloudflare Workers / Vercel / Netlify)

Danach in `app.js`:

    feedbackEndpoint: "https://formspree.io/f/DEINE_ID"

Wichtig:
Das Formular fragt keinen Namen und keine E-Mail-Adresse ab. Der jeweilige Form-Dienst kann technisch trotzdem Metadaten (z. B. IP-Adresse) verarbeiten. Wenn du „anonym“ auf der Website versprichst, sollte die Datenschutzerklärung das korrekt beschreiben.

## 5. Inhalte ändern
Texte zu About Me, Events und Partner findest du direkt in `index.html`.

## 6. Optional
Für eine vollständig professionelle öffentliche Version fehlen später noch:
- Impressum
- Datenschutzerklärung
- echte Partner-Logos/Links
- finale Event-Termine
- Social Links
