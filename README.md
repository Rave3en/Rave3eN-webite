# Rave3eN Website

Upload-fertige statische Creator-Website im Rave3eN Style. Enthalten sind Twitch Player + Chat, Spotify Playlist, About Me, Events, Partner, anonymes Feedback, mobile Navigation, Intro-Animation, responsive Design und Custom-Domain-Datei.

## Schnellstart mit GitHub
1. Neues **öffentliches oder privates GitHub Repository** erstellen.
2. **Alle Dateien aus diesem Ordner direkt ins Repository-Root** hochladen (nicht den übergeordneten Ordner als zusätzliche Ebene).
3. Committen.

Die Website kann technisch über GitHub Pages laufen. Das anonyme Feedback benötigt aber ein Backend. Deshalb ist für die vollständige Version **Netlify mit dem GitHub Repository als Quelle** empfohlen.

## Empfohlen: GitHub + Netlify
1. Repository wie oben zu GitHub hochladen.
2. Bei Netlify: **Add new site → Import an existing project → GitHub**.
3. Das Rave3eN Repository auswählen.
4. Es gibt keinen Build-Befehl. Publish directory ist `.` (durch `netlify.toml` bereits gesetzt).
5. Deploy starten.
6. In Netlify unter **Forms** erscheinen neue anonyme Feedback-Einsendungen. Sie werden nicht auf der Website veröffentlicht.

## Eigene Domain rave3en.de
Die Datei `CNAME` ist bereits auf `rave3en.de` gesetzt. Die DNS-Einträge müssen beim Domain-Anbieter passend zum gewählten Hosting gesetzt werden. Wenn du zunächst nur die Netlify-Testdomain nutzen willst, kann `CNAME` drin bleiben oder vorübergehend gelöscht werden.

## Twitch
Kanal: `rave3en`. Der Player wird beim Besuch automatisch initialisiert und versucht, den Stream mit ca. 6 % Lautstärke zu starten. Moderne Browser dürfen hörbares Autoplay blockieren; der Sound-Button im Twitch-Dock aktiviert den Ton dann nach Nutzerinteraktion. Twitch-Embeds benötigen eine HTTPS-Domain und einen korrekten `parent`-Host; dieser wird automatisch aus der aktuellen Domain erzeugt.

## Spotify
Playlist ist bereits fest eingebaut:
`https://open.spotify.com/playlist/1RUL905g3PozmTWp8fAZCs`

Spotify startet nicht ungefragt mit Sound. Der Besucher öffnet den Player und startet die Musik selbst.

## Inhalte ändern
Die zentralen Inhalte stehen ganz oben in `app.js`:
- `twitchChannel`
- `twitchStartVolume`
- `spotifyPlaylistUrl`
- `events`
- `partners`

## Dateien
- `index.html` – Website
- `styles.css` – komplettes Design
- `app.js` – Twitch, Spotify, Events, Partner, Form-Logik
- `danke.html` – Feedback-Erfolgsseite
- `404.html` – Fehlerseite
- `netlify.toml` – Netlify-Konfiguration + Sicherheitsheader
- `CNAME` – Custom Domain
- `assets/` – Logo und Icons

## Wichtig zum Feedback
Das Formular fragt weder Name noch E-Mail ab. Technisch kann ein Hosting-Anbieter trotzdem übliche Server-/Request-Metadaten verarbeiten. Auf der Website werden keine identifizierenden Felder abgefragt und Einsendungen werden nicht öffentlich dargestellt.
