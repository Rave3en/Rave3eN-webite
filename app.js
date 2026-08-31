const CONFIG = {
  twitchChannel: 'rave3en',
  twitchStartVolume: 0.06,
  spotifyPlaylistUrl: 'https://open.spotify.com/playlist/1RUL905g3PozmTWp8fAZCs',
  events: [
    { eyebrow: 'COMMUNITY', title: 'Community Games', text: 'Zusammen spielen, lachen und eskalieren — Community statt Leistungsdruck.', tag: 'REGELMÄSSIG', icon: '◎' },
    { eyebrow: 'SPECIAL', title: 'Rave Specials', text: 'Besondere Streams, Challenges und Formate mit eigener Atmosphäre.', tag: 'LIVE', icon: '✦' },
    { eyebrow: 'HEART', title: 'Charity & Aktionen', text: 'Community-Power für Dinge, die über den Stream hinaus etwas bewegen.', tag: 'CHARITY', icon: '♡' }
  ],
  partners: [
    { name: 'Arena Breakout Infinite', text: 'Gaming-Partnerschaft & Creator Content.', tag: 'GAMING', mark: 'ABI' },
    { name: 'BuffBuff', text: 'Community-Partner für ausgewählte Aktionen und Angebote.', tag: 'PARTNER', mark: 'BB' },
    { name: 'Epic Desk', text: 'Creator-Partnerschaft rund um Setup und Desk.', tag: 'SETUP', mark: 'ED' }
  ]
};

const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];

window.addEventListener('load',()=>setTimeout(()=>$('#intro')?.classList.add('done'),520));
document.addEventListener('DOMContentLoaded',()=>{
  $('#year').textContent=new Date().getFullYear();
  renderCards(); setupReveal(); setupNav(); setupFeedback(); setupMediaDock(); setupSpotify(); setupParallax();
});

function renderCards(){
  $('#eventsGrid').innerHTML=CONFIG.events.map((e,i)=>`<article class="event-card"><div class="event-top"><span class="event-icon">${e.icon}</span><span class="event-tag">${e.tag}</span></div><small>${String(i+1).padStart(2,'0')} / ${e.eyebrow}</small><h3>${e.title}</h3><p>${e.text}</p><i class="card-glow"></i></article>`).join('');
  $('#partnerGrid').innerHTML=CONFIG.partners.map(p=>`<article class="partner-card"><div class="partner-mark">${p.mark}</div><span class="partner-tag">${p.tag}</span><h3>${p.name}</h3><p>${p.text}</p><i class="card-glow"></i></article>`).join('');
}

function setupReveal(){
  const els=$$('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('visible'));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.1}); els.forEach(el=>io.observe(el));
}

function setupNav(){
  const btn=$('#menuButton'),nav=$('#mobileNav'); if(!btn||!nav)return;
  const set=open=>{btn.setAttribute('aria-expanded',String(open));nav.setAttribute('aria-hidden',String(!open));nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open)};
  btn.addEventListener('click',()=>set(!nav.classList.contains('open'))); $$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>set(false)));
}

function setupFeedback(){
  const form=$('#feedbackForm'),text=$('#feedbackText'),count=$('#charCount'),status=$('#formStatus');
  text.addEventListener('input',()=>count.textContent=`${text.value.length} / 3000`);
  form.addEventListener('submit',ev=>{
    const local=location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.protocol==='file:'||location.hostname.endsWith('github.io');
    if(local){ev.preventDefault();status.textContent=location.hostname.endsWith('github.io')?'Feedback ist auf GitHub Pages nur Demo. Für private Einsendungen bitte über Netlify deployen.':'Lokale Vorschau: Feedback wird erst im Netlify-Deploy gespeichert.';return;}
    status.textContent='Wird anonym gesendet …';
  });
}

let twitchPlayer=null,twitchLoaded=false,chatVisible=true,twitchMuted=false;
function setupMediaDock(){
  const twToggle=$('#twitchToggle'),twPanel=$('#twitchPanel'),spToggle=$('#spotifyToggle'),spPanel=$('#spotifyPanel');
  const setPanel=(panel,button,open)=>{panel.classList.toggle('open',open);panel.setAttribute('aria-hidden',String(!open));button.setAttribute('aria-expanded',String(open));};
  const openTwitch=()=>{setPanel(twPanel,twToggle,true);loadTwitch();};
  twToggle.addEventListener('click',()=>{const open=!twPanel.classList.contains('open');setPanel(twPanel,twToggle,open);if(open)loadTwitch();});
  $('#twitchClose').addEventListener('click',()=>setPanel(twPanel,twToggle,false));
  $$('[data-open-stream]').forEach(btn=>{btn.addEventListener('click',openTwitch);btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openTwitch();}})});
  spToggle.addEventListener('click',()=>setPanel(spPanel,spToggle,!spPanel.classList.contains('open'))); $('#spotifyClose').addEventListener('click',()=>setPanel(spPanel,spToggle,false));
  $('#openSpotify').addEventListener('click',()=>setPanel(spPanel,spToggle,true));
  $('#chatToggle').addEventListener('click',()=>{chatVisible=!chatVisible;$('#twitchGrid').classList.toggle('chat-hidden',!chatVisible);$('#chatToggle').textContent=chatVisible?'Chat ausblenden':'Chat einblenden';});
  $('#twitchSound').addEventListener('click',()=>{if(!twitchPlayer){loadTwitch();return;}twitchMuted=!twitchMuted;twitchPlayer.setMuted(twitchMuted);if(!twitchMuted)twitchPlayer.setVolume(CONFIG.twitchStartVolume);$('#twitchSound').textContent=twitchMuted?'Sound: aus':'Sound: leise';});
  setTimeout(loadTwitch,700);
}

function loadTwitch(){
  if(twitchLoaded)return; if(typeof Twitch==='undefined'){setTimeout(loadTwitch,300);return;} twitchLoaded=true;
  const host=location.hostname||'localhost';
  try{
    twitchPlayer=new Twitch.Player('twitchPlayer',{channel:CONFIG.twitchChannel,width:'100%',height:'100%',autoplay:true,muted:true,parent:[host]});
    twitchPlayer.addEventListener(Twitch.Player.READY,()=>{try{twitchPlayer.setVolume(CONFIG.twitchStartVolume);twitchPlayer.setMuted(false);twitchPlayer.play();twitchMuted=false;}catch(_){twitchMuted=true;$('#twitchSound').textContent='Sound: aktivieren';}});
    const chat=document.createElement('iframe');chat.title='Twitch Chat';chat.loading='lazy';chat.allow='clipboard-read; clipboard-write';chat.src=`https://www.twitch.tv/embed/${encodeURIComponent(CONFIG.twitchChannel)}/chat?parent=${encodeURIComponent(host)}&darkpopout`;$('#chatFrame').appendChild(chat);
  }catch(_){twitchLoaded=false;}
}

function setupSpotify(){
  const match=CONFIG.spotifyPlaylistUrl.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/); if(!match)return;
  const iframe=document.createElement('iframe');iframe.title='Spotify Playlist';iframe.src=`https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.loading='lazy';$('#spotifyEmbed').appendChild(iframe);
}

function setupParallax(){
  const el=$('[data-parallax]');if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  window.addEventListener('pointermove',e=>{if(innerWidth<900)return;const x=(e.clientX/innerWidth-.5)*12,y=(e.clientY/innerHeight-.5)*10;el.style.setProperty('--px',`${x}px`);el.style.setProperty('--py',`${y}px`);},{passive:true});
}
