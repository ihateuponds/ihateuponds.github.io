(() => {
  const TIMEZONE = "America/New_York";

  // 1. Live EDT Telemetry Clock
  const clockEl = document.getElementById("clock-display");
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    clockEl.textContent = formatter.format(now);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Font Mode Switcher
  const fontBtn = document.getElementById("font-toggle-btn");
  const body = document.getElementById("page-body");
  const fontOptions = [
    { name: "mono", family: "'JetBrains Mono', monospace" },
    { name: "pixel", family: "'VT323', monospace" },
    { name: "tech", family: "'Share Tech Mono', monospace" }
  ];
  let currentFontIdx = 0;

  if (fontBtn && body) {
    fontBtn.addEventListener("click", () => {
      currentFontIdx = (currentFontIdx + 1) % fontOptions.length;
      body.style.fontFamily = fontOptions[currentFontIdx].family;
      fontBtn.textContent = "font: " + fontOptions[currentFontIdx].name;
    });
  }

  // 3. Thought Radar Roller
  const thoughtQuotes = [
    "why does every modern site look like a generic corporate pitch deck? make the web personal and weird again.",
    "thinking about how wayland screen sharing was broken for 4 years and now it finally works.",
    "if you don't listen to brakence at 2am while debugging a kernel panic what are you even doing?",
    "remember when websites had under construction gifs and guestbooks instead of cookie banners and popups?",
    "my cachyos install idles at 1.2gb of ram. windows 11 idles at 6.4gb just to show candy crush in the start menu.",
    "radical red is the best pokemon romhack of all time, do not @ me.",
    "pipewire pro-audio routing is the single greatest thing to happen to linux desktop in a decade."
  ];

  const rollBtn = document.getElementById("btn-roll-thought");
  const quoteEl = document.getElementById("thought-quote");

  if (rollBtn && quoteEl) {
    rollBtn.addEventListener("click", () => {
      const randomIdx = Math.floor(Math.random() * thoughtQuotes.length);
      quoteEl.textContent = `"${thoughtQuotes[randomIdx]}"`;
    });
  }

  // 4. Retro CD Music Player
  const playlist = [
    { title: "INTROVERT", artist: "brakence", src: "https://files.catbox.moe/sb1eqh.mp3" },
    { title: "52 BLUE MONDAYS", artist: "Jane Remover", src: "https://files.catbox.moe/6ta5uh.mp3" },
    { title: "BABY G SHOCK", artist: "cr1tter", src: "https://files.catbox.moe/dv3lyv.mp3" },
    { title: "I WISH I WAS A CAT", artist: "Glitch Gum", src: "https://files.catbox.moe/5xsgcf.mp3" },
    { title: "ROUND TWO", artist: "guardin", src: "https://files.catbox.moe/mtwm5i.mp3" }
  ];

  let currentTrack = 0;
  const audio = document.getElementById("audio-element");
  const playBtn = document.getElementById("btn-play");
  const prevBtn = document.getElementById("btn-prev");
  const nextBtn = document.getElementById("btn-next");
  const cdDisc = document.getElementById("cd-disc");
  const trackTitle = document.getElementById("player-title");
  const trackArtist = document.getElementById("player-artist");
  const trackTime = document.getElementById("player-time");
  const trackSelect = document.getElementById("track-select");

  function loadTrack(idx) {
    currentTrack = idx;
    const track = playlist[currentTrack];
    if (audio) audio.src = track.src;
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (trackSelect) trackSelect.value = currentTrack;
  }

  loadTrack(0);

  function togglePlay() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        if (playBtn) playBtn.textContent = "⏸ PAUSE";
        if (cdDisc) cdDisc.classList.add("spinning");
      }).catch(() => {
        if (playBtn) playBtn.textContent = "▶ PLAY";
      });
    } else {
      audio.pause();
      if (playBtn) playBtn.textContent = "▶ PLAY";
      if (cdDisc) cdDisc.classList.remove("spinning");
    }
  }

  if (playBtn) playBtn.addEventListener("click", togglePlay);

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIdx = (currentTrack + 1) % playlist.length;
      loadTrack(nextIdx);
      if (audio) {
        audio.play().then(() => {
          if (playBtn) playBtn.textContent = "⏸ PAUSE";
          if (cdDisc) cdDisc.classList.add("spinning");
        });
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const prevIdx = (currentTrack - 1 + playlist.length) % playlist.length;
      loadTrack(prevIdx);
      if (audio) {
        audio.play().then(() => {
          if (playBtn) playBtn.textContent = "⏸ PAUSE";
          if (cdDisc) cdDisc.classList.add("spinning");
        });
      }
    });
  }

  if (trackSelect) {
    trackSelect.addEventListener("change", (e) => {
      const idx = parseInt(e.target.value, 10);
      loadTrack(idx);
      if (audio) {
        audio.play().then(() => {
          if (playBtn) playBtn.textContent = "⏸ PAUSE";
          if (cdDisc) cdDisc.classList.add("spinning");
        });
      }
    });
  }

  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if (!trackTime || !audio.duration) return;
      const curM = Math.floor(audio.currentTime / 60);
      const curS = Math.floor(audio.currentTime % 60).toString().padStart(2, "0");
      const durM = Math.floor(audio.duration / 60);
      const durS = Math.floor(audio.duration % 60).toString().padStart(2, "0");
      trackTime.textContent = `${curM}:${curS} / ${durM}:${durS}`;
    });

    audio.addEventListener("ended", () => {
      if (nextBtn) nextBtn.click();
    });
  }

  // 5. Ghost Pokemon Team Inspector
  const pkmnSlots = document.querySelectorAll(".pokemon-slot");
  const inspectName = document.getElementById("inspect-name");
  const inspectType = document.getElementById("inspect-type");
  const inspectAbility = document.getElementById("inspect-ability");
  const inspectItem = document.getElementById("inspect-item");
  const inspectMoves = document.getElementById("inspect-moves");

  pkmnSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      pkmnSlots.forEach(s => s.classList.remove("active"));
      slot.classList.add("active");

      if (inspectName) inspectName.textContent = slot.getAttribute("data-name");
      if (inspectType) inspectType.textContent = slot.getAttribute("data-type");
      if (inspectAbility) inspectAbility.textContent = slot.getAttribute("data-ability");
      if (inspectItem) inspectItem.textContent = slot.getAttribute("data-item");
      if (inspectMoves) inspectMoves.textContent = slot.getAttribute("data-moves");
    });
  });

  // 6. Web Clap Widget (ries.neocities.org inspiration)
  const clapBtn = document.getElementById("btn-web-clap");
  const clapCounter = document.getElementById("clap-counter");
  const clapMsg = document.getElementById("clap-msg");

  let claps = parseInt(localStorage.getItem("ponds_web_claps") || "42", 10);
  if (clapCounter) clapCounter.textContent = claps;

  if (clapBtn) {
    clapBtn.addEventListener("click", () => {
      claps++;
      localStorage.setItem("ponds_web_claps", claps.toString());
      if (clapCounter) clapCounter.textContent = claps;
      if (clapMsg) {
        clapMsg.hidden = false;
        setTimeout(() => { clapMsg.hidden = true; }, 2500);
      }
    });
  }

  // 7. Copy Embed Snippet
  const copyEmbedBtn = document.getElementById("btn-copy-embed");
  const embedCode = document.getElementById("button-embed-code");

  if (copyEmbedBtn && embedCode) {
    copyEmbedBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(embedCode.value);
        const originalText = copyEmbedBtn.textContent;
        copyEmbedBtn.textContent = "✓ Copied to clipboard!";
        setTimeout(() => { copyEmbedBtn.textContent = originalText; }, 2500);
      } catch (err) {
        embedCode.select();
      }
    });
  }
})();
