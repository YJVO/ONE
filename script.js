const songs = [
  { id: 1, title: "Midnight Drive", artist: "ONE", album: "After Dark", genre: "Electronic", duration: "3:42", audio: "assets/audio/midnight-drive.mp3", cover: "assets/covers/cover-1.svg" },
  { id: 2, title: "Neon Dreams", artist: "LUNA", album: "Neon Dreams", genre: "Pop", duration: "3:18", audio: "assets/audio/neon-dreams.mp3", cover: "assets/covers/cover-2.svg" },
  { id: 3, title: "City Lights", artist: "NOVA", album: "Night City", genre: "R&B", duration: "4:05", audio: "assets/audio/city-lights.mp3", cover: "assets/covers/cover-3.svg" },
  { id: 4, title: "Gravity", artist: "KAIRO", album: "Gravity", genre: "Electronic", duration: "3:51", audio: "assets/audio/gravity.mp3", cover: "assets/covers/cover-4.svg" },
  { id: 5, title: "Golden Hour", artist: "MIRA", album: "Sol", genre: "Indie", duration: "3:27", audio: "assets/audio/golden-hour.mp3", cover: "assets/covers/cover-5.svg" },
  { id: 6, title: "Pulse", artist: "VOLT", album: "Pulse", genre: "Dance", duration: "3:36", audio: "assets/audio/pulse.mp3", cover: "assets/covers/cover-6.svg" },
  { id: 7, title: "After Rain", artist: "ELIO", album: "Blue Hour", genre: "Chill", duration: "4:11", audio: "assets/audio/after-rain.mp3", cover: "assets/covers/cover-7.svg" },
  { id: 8, title: "Horizons", artist: "SORA", album: "Horizons", genre: "Ambient", duration: "5:02", audio: "assets/audio/horizons.mp3", cover: "assets/covers/cover-8.svg" }
];

const playlists = {
  "Vibras ONE": [1, 2, 5, 8],
  "Noche": [1, 3, 4, 7],
  "Energía": [2, 4, 6, 8]
};

const audio = document.getElementById("audio");
const page = document.getElementById("page");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const playButton = document.getElementById("playButton");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const playerLike = document.getElementById("playerLike");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const likedCount = document.getElementById("likedCount");
const toast = document.getElementById("toast");

let currentSong = null;
let queue = [...songs];
let queueIndex = 0;
let shuffle = false;
let repeat = false;
let toastTimer;

const state = {
  liked: JSON.parse(localStorage.getItem("one-liked") || "[]"),
  theme: localStorage.getItem("one-theme") || "dark"
};

function saveState() {
  localStorage.setItem("one-liked", JSON.stringify(state.liked));
  localStorage.setItem("one-theme", state.theme);
  likedCount.textContent = state.liked.length;
}

function isLiked(id) { return state.liked.includes(id); }

function toggleLike(id) {
  state.liked = isLiked(id) ? state.liked.filter(x => x !== id) : [...state.liked, id];
  saveState();
  renderCurrentView();
  updatePlayerLike();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function playSong(songOrId, list = songs) {
  const song = typeof songOrId === "number" ? songs.find(s => s.id === songOrId) : songOrId;
  if (!song) return;

  queue = [...list];
  queueIndex = Math.max(0, queue.findIndex(s => s.id === song.id));
  currentSong = song;

  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  playerCover.src = song.cover;
  playerCover.alt = `${song.title} — ${song.artist}`;
  audio.src = song.audio;
  audio.load();

  audio.play().then(() => {
    playButton.textContent = "❚❚";
  }).catch(() => {
    playButton.textContent = "▶";
    showToast("Añade el archivo MP3 en assets/audio/ para reproducir esta canción.");
  });

  updatePlayerLike();
}

function updatePlayerLike() {
  playerLike.textContent = currentSong && isLiked(currentSong.id) ? "♥" : "♡";
  playerLike.classList.toggle("liked", !!currentSong && isLiked(currentSong.id));
}

function songRow(song) {
  return `
    <div class="song-row" data-song="${song.id}">
      <img class="song-thumb" src="${song.cover}" alt="" loading="lazy">
      <div class="song-info">
        <strong>${song.title}</strong>
        <span>${song.artist} · ${song.album}</span>
      </div>
      <span class="row-duration">${song.duration}</span>
      <button class="heart ${isLiked(song.id) ? "liked" : ""}" data-like="${song.id}" aria-label="Favorito">${isLiked(song.id) ? "♥" : "♡"}</button>
    </div>
  `;
}

function card(song) {
  return `
    <article class="card" data-song="${song.id}">
      <div class="cover-wrap">
        <img src="${song.cover}" alt="${song.title}" loading="lazy">
        <button class="card-play" data-play="${song.id}" aria-label="Reproducir ${song.title}">▶</button>
      </div>
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
    </article>
  `;
}

function section(title, content, action = "") {
  return `<section class="section"><div class="section-header"><h2>${title}</h2>${action ? `<button class="text-button" data-view="${action}">Ver todo</button>` : ""}</div>${content}</section>`;
}

function renderHome() {
  page.innerHTML = `
    <div class="hero">
      <div class="hero-copy">
        <div class="eyebrow">Tu música. Tu momento.</div>
        <h1>Todo suena mejor en ONE.</h1>
        <p>Descubre nuevos sonidos, crea tus playlists y disfruta tu música desde cualquier lugar.</p>
        <button class="primary-btn" data-play="${songs[0].id}">▶ Escuchar ahora</button>
      </div>
    </div>
    ${section("Escuchado recientemente", `<div class="card-grid">${songs.slice(0, 5).map(card).join("")}</div>`)}
    ${section("Para ti", `<div class="song-list">${songs.slice(3, 8).map(songRow).join("")}</div>`)}
  `;
}

function renderDiscover() {
  const genres = ["Todos", ...new Set(songs.map(s => s.genre))];
  page.innerHTML = `
    <div class="section" style="margin-top:0">
      <div class="eyebrow">Explora ONE</div>
      <h1 style="font-size:42px;margin:8px 0 10px">Descubrir</h1>
      <p style="color:var(--muted)">Encuentra sonidos para cada momento.</p>
      <div class="card-grid" style="margin-top:25px">${songs.map(card).join("")}</div>
    </div>
    ${section("Todos los temas", `<div class="song-list">${songs.map(songRow).join("")}</div>`)}
  `;
}

function renderLibrary() {
  page.innerHTML = `
    <div class="section" style="margin-top:0">
      <div class="eyebrow">Tu colección</div>
      <h1 style="font-size:42px;margin:8px 0 25px">Tu biblioteca</h1>
      <div class="card-grid">
        ${Object.keys(playlists).map(name => `
          <article class="card" data-playlist="${name}">
            <div class="cover-wrap"><img src="${songs.find(s => s.id === playlists[name][0]).cover}" alt=""></div>
            <h3>${name}</h3><p>${playlists[name].length} canciones</p>
          </article>`).join("")}
      </div>
    </div>
    ${section("Todas tus canciones", `<div class="song-list">${songs.map(songRow).join("")}</div>`)}
  `;
}

function renderLiked() {
  const liked = songs.filter(s => isLiked(s.id));
  page.innerHTML = `
    <div class="section" style="margin-top:0">
      <div class="eyebrow">Tu música</div>
      <h1 style="font-size:42px;margin:8px 0 25px">Favoritos</h1>
      ${liked.length ? `<div class="song-list">${liked.map(songRow).join("")}</div>` :
      `<div class="empty"><strong>Aún no tienes favoritos</strong>Presiona ♡ en cualquier canción para guardarla aquí.</div>`}
    </div>
  `;
}

function renderQueue() {
  page.innerHTML = `
    <div class="section" style="margin-top:0">
      <div class="eyebrow">Reproductor</div>
      <h1 style="font-size:42px;margin:8px 0 25px">Cola</h1>
      <div class="song-list">${queue.map(songRow).join("")}</div>
    </div>
  `;
}

function renderPlaylist(name) {
  const list = (playlists[name] || []).map(id => songs.find(s => s.id === id)).filter(Boolean);
  page.innerHTML = `
    <div class="section" style="margin-top:0">
      <div class="eyebrow">Playlist</div>
      <h1 style="font-size:42px;margin:8px 0 25px">${name}</h1>
      <div class="song-list">${list.map(songRow).join("")}</div>
    </div>
  `;
}

let currentView = "home";

function renderCurrentView() {
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const results = songs.filter(s => `${s.title} ${s.artist} ${s.album} ${s.genre}`.toLowerCase().includes(query));
    page.innerHTML = `
      <div class="section" style="margin-top:0">
        <div class="eyebrow">Resultados</div>
        <h1 style="font-size:38px;margin:8px 0 25px">Búsqueda: “${escapeHtml(searchInput.value)}”</h1>
        ${results.length ? `<div class="song-list">${results.map(songRow).join("")}</div>` :
        `<div class="empty"><strong>No encontramos resultados</strong>Prueba con otro artista, canción o género.</div>`}
      </div>`;
    return;
  }

  if (currentView === "home") renderHome();
  else if (currentView === "discover") renderDiscover();
  else if (currentView === "library") renderLibrary();
  else if (currentView === "liked") renderLiked();
  else if (currentView === "queue") renderQueue();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  renderCurrentView();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) setView(viewButton.dataset.view);

  const play = event.target.closest("[data-play]");
  if (play) playSong(Number(play.dataset.play));

  const row = event.target.closest(".song-row");
  if (row && !event.target.closest("[data-like]")) playSong(Number(row.dataset.song));

  const like = event.target.closest("[data-like]");
  if (like) {
    event.stopPropagation();
    toggleLike(Number(like.dataset.like));
  }

  const playlist = event.target.closest("[data-playlist]");
  if (playlist) renderPlaylist(playlist.dataset.playlist);

  if (event.target.closest("#menuButton")) document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("playButton").addEventListener("click", () => {
  if (!currentSong) return playSong(songs[0]);
  if (audio.paused) audio.play().then(() => playButton.textContent = "❚❚").catch(() => {});
  else audio.pause();
});

document.getElementById("nextButton").addEventListener("click", nextSong);
document.getElementById("prevButton").addEventListener("click", () => {
  if (audio.currentTime > 4) {
    audio.currentTime = 0;
    return;
  }
  queueIndex = (queueIndex - 1 + queue.length) % queue.length;
  playSong(queue[queueIndex], queue);
});
document.getElementById("shuffleButton").addEventListener("click", (e) => {
  shuffle = !shuffle;
  e.currentTarget.classList.toggle("active", shuffle);
  showToast(shuffle ? "Aleatorio activado" : "Aleatorio desactivado");
});
document.getElementById("repeatButton").addEventListener("click", (e) => {
  repeat = !repeat;
  e.currentTarget.classList.toggle("active", repeat);
  showToast(repeat ? "Repetición activada" : "Repetición desactivada");
});
playerLike.addEventListener("click", () => currentSong && toggleLike(currentSong.id));

function nextSong() {
  if (!queue.length) return;
  if (shuffle) queueIndex = Math.floor(Math.random() * queue.length);
  else queueIndex = (queueIndex + 1) % queue.length;
  playSong(queue[queueIndex], queue);
}

audio.addEventListener("play", () => playButton.textContent = "❚❚");
audio.addEventListener("pause", () => playButton.textContent = "▶");
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("ended", () => {
  if (repeat) {
    audio.currentTime = 0;
    audio.play();
  } else nextSong();
});
progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});
volume.addEventListener("input", () => audio.volume = Number(volume.value));
audio.volume = .75;

searchInput.addEventListener("input", () => {
  clearSearch.style.display = searchInput.value ? "block" : "none";
  renderCurrentView();
});
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  clearSearch.style.display = "none";
  renderCurrentView();
  searchInput.focus();
});

document.getElementById("themeButton").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "dim" : "dark";
  document.documentElement.style.setProperty("--bg", state.theme === "dim" ? "#12141a" : "#09090d");
  saveState();
});

document.getElementById("notificationButton").addEventListener("click", () => showToast("No tienes notificaciones nuevas."));

saveState();
renderCurrentView();
