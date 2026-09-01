
const CONFIG = {
  twitchChannel: "rave3en",
  twitchParents: ["rave3en.de", "www.rave3en.de", window.location.hostname].filter(Boolean),
  feedbackEndpoint: ""
};

document.getElementById("year").textContent = new Date().getFullYear();

const liveShell = document.querySelector(".live-shell");
const closeChat = document.getElementById("closeChat");
const openChat = document.getElementById("openChat");
const chat = document.getElementById("twitchChat");
const soundNudge = document.getElementById("soundNudge");

function uniqueParents(items){
  return [...new Set(items.filter(host => host && host !== "localhost" && host !== "127.0.0.1"))];
}

function setupTwitchChat(){
  const parents = uniqueParents(CONFIG.twitchParents);
  const parentQuery = parents.map(p => `parent=${encodeURIComponent(p)}`).join("&");
  chat.src = `https://www.twitch.tv/embed/${encodeURIComponent(CONFIG.twitchChannel)}/chat?darkpopout&${parentQuery}`;
}

function setupTwitchPlayer(){
  if (!window.Twitch?.Player) return;

  const parents = uniqueParents(CONFIG.twitchParents);
  const player = new Twitch.Player("twitch-player", {
    channel: CONFIG.twitchChannel,
    width: "100%",
    height: "100%",
    autoplay: true,
    muted: true,
    parent: parents.length ? parents : undefined
  });

  player.addEventListener(Twitch.Player.READY, () => {
    try{
      player.setVolume(0.08);
      player.setMuted(false);

      setTimeout(() => {
        try{
          if (player.getMuted()) soundNudge.hidden = false;
        }catch(e){
          soundNudge.hidden = false;
        }
      }, 1400);
    }catch(e){
      soundNudge.hidden = false;
    }
  });

  soundNudge.addEventListener("click", () => {
    try{
      player.setVolume(0.08);
      player.setMuted(false);
      soundNudge.hidden = true;
    }catch(e){}
  });
}

if (closeChat) closeChat.addEventListener("click", () => liveShell.classList.add("chat-hidden"));
if (openChat) openChat.addEventListener("click", () => liveShell.classList.remove("chat-hidden"));

const musicOff = document.getElementById("musicOff");
const musicOn = document.getElementById("musicOn");
const spotifyEmbed = document.getElementById("spotifyEmbed");

function setMusicMode(on){
  musicOn.classList.toggle("active", on);
  musicOff.classList.toggle("active", !on);
  if(on) spotifyEmbed.scrollIntoView({behavior:"smooth", block:"nearest"});
}
if (musicOn) musicOn.addEventListener("click", () => setMusicMode(true));
if (musicOff) musicOff.addEventListener("click", () => setMusicMode(false));

const feedbackForm = document.getElementById("feedbackForm");
const formStatus = document.getElementById("formStatus");

if (feedbackForm){
  feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if(!CONFIG.feedbackEndpoint){
      formStatus.textContent = "Feedback ist aktuell vorübergehend nicht verfügbar.";
      return;
    }

    const button = feedbackForm.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Wird gesendet …";
    formStatus.textContent = "";

    try{
      const response = await fetch(CONFIG.feedbackEndpoint, {
        method: "POST",
        headers: {"Accept": "application/json"},
        body: new FormData(feedbackForm)
      });

      if(!response.ok) throw new Error();

      feedbackForm.reset();
      formStatus.textContent = "Danke. Dein Feedback wurde gesendet.";
    }catch(error){
      formStatus.textContent = "Das hat nicht funktioniert. Bitte später noch einmal versuchen.";
    }finally{
      button.disabled = false;
      button.textContent = "Feedback senden";
    }
  });
}

setupTwitchChat();
setupTwitchPlayer();
