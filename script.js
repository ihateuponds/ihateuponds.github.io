/**
 * ★ PONDS // HYPERPOP & POKÉMON SCRAPBOOK INTERACTIVE ENGINE ★
 * Features:
 * 1. Web Audio Synth SFX & Live Hyperpop Chiptune Player
 * 2. Sparkle Pixel Cursor Trail
 * 3. Draggable Sticker Playground
 * 4. Interactive Pokémon Dream Team & Shiny Inspector
 * 5. Live Digital Clock & Quote Generator
 * 6. Retro CRT & Sound FX Toggles
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. WEB AUDIO API SYNTHESIZER (SFX & HYPERPOP SYNTH ENGINE)
     ------------------------------------------------------------------------ */
  let audioCtx = null;
  let sfxEnabled = true;
  let isPlayingMusic = false;
  let musicInterval = null;
  let currentTrackIdx = 0;
  let masterGain = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a quick retro UI sound
  function playSfx(type) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'powerup') {
        osc.type = 'square';
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const noteOsc = audioCtx.createOscillator();
          const noteGain = audioCtx.createGain();
          noteOsc.type = 'square';
          noteOsc.frequency.setValueAtTime(freq, now + i * 0.06);
          noteGain.gain.setValueAtTime(0.15, now + i * 0.06);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.06);
          noteOsc.connect(noteGain);
          noteGain.connect(masterGain);
          noteOsc.start(now + i * 0.06);
          noteOsc.stop(now + (i + 1) * 0.06);
        });
      } else if (type === 'cry') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(640, now + 0.08);
        osc.frequency.linearRampToValueAtTime(240, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // Real Music Playlist (Hosted on GitHub Pages CDN with local fallbacks)
  const tracks = [
    {
      title: "INTROVERT",
      artist: "brakence",
      genre: "EMO RAP / HYPERPOP",
      src: "https://ihateuponds.github.io/music/introvert.mp3",
      fallbackSrc: "./music/introvert.mp3",
      localSrc: "./music/introvert.mp3"
    },
    {
      title: "52 BLUE MONDAYS",
      artist: "Jane Remover",
      genre: "DARIACRE / SHOEGAZE",
      src: "https://ihateuponds.github.io/music/52-blue-mondays.mp3",
      fallbackSrc: "./music/52-blue-mondays.mp3",
      localSrc: "./music/52-blue-mondays.mp3"
    },
    {
      title: "BABY G SHOCK",
      artist: "cr1tter",
      genre: "HYPERPOP / RAP",
      src: "https://ihateuponds.github.io/music/baby-g-shock.mp3",
      fallbackSrc: "./music/baby-g-shock.mp3",
      localSrc: "./music/baby-g-shock.mp3"
    },
    {
      title: "I WISH I WAS A CAT",
      artist: "Glitch Gum",
      genre: "HYPERPOP / GLITCH",
      src: "https://ihateuponds.github.io/music/i-wish-i-was-a-cat.mp3",
      fallbackSrc: "./music/i-wish-i-was-a-cat.mp3",
      localSrc: "./music/i-wish-i-was-a-cat.mp3"
    },
    {
      title: "ROUND TWO",
      artist: "guardin",
      genre: "INDIE / EMO",
      src: "https://ihateuponds.github.io/music/round-two.mp3",
      fallbackSrc: "./music/round-two.mp3",
      localSrc: "./music/round-two.mp3"
    }
  ];

  /* ------------------------------------------------------------------------
     2. REAL CD PLAYER UI CONTROLS & TIMELINE ENGINE
     ------------------------------------------------------------------------ */
  const realAudioPlayer = document.getElementById('real-audio-player') || new Audio();
  const cdDisc = document.getElementById('cd-disc');
  const cdAlbumTitle = document.getElementById('cd-album-title');
  const cdAlbumArtist = document.getElementById('cd-album-artist');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnPrevTrack = document.getElementById('btn-prev-track');
  const btnNextTrack = document.getElementById('btn-next-track');
  const equalizer = document.getElementById('equalizer');
  const trackTitleEl = document.getElementById('current-track-title');
  const trackArtistEl = document.getElementById('current-track-artist');
  const trackGenreEl = document.getElementById('track-genre');
  const trackIndexDisplay = document.getElementById('track-index-display');
  const trackCurrentTime = document.getElementById('track-current-time');
  const trackDuration = document.getElementById('track-duration');
  const audioProgressBar = document.getElementById('audio-progress-bar');
  const audioProgressFill = document.getElementById('audio-progress-fill');
  const volumeSlider = document.getElementById('volume-slider');
  const volIconBtn = document.getElementById('vol-icon-btn');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function loadTrack(idx, playImmediately = false) {
    currentTrackIdx = (idx + tracks.length) % tracks.length;
    const track = tracks[currentTrackIdx];

    if (trackTitleEl) trackTitleEl.textContent = track.title;
    if (trackArtistEl) trackArtistEl.textContent = track.artist;
    if (trackGenreEl) trackGenreEl.textContent = track.genre;
    if (trackIndexDisplay) {
      trackIndexDisplay.textContent = `TRACK ${String(currentTrackIdx + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`;
    }
    if (cdAlbumTitle) cdAlbumTitle.textContent = track.artist.split(' ')[0].toUpperCase().substring(0, 8);
    if (cdAlbumArtist) cdAlbumArtist.textContent = `VOL. 0${currentTrackIdx + 1}`;

    realAudioPlayer.src = track.src;
    realAudioPlayer.load();

    if (trackCurrentTime) trackCurrentTime.textContent = "0:00";
    if (trackDuration) trackDuration.textContent = "0:00";
    if (audioProgressFill) audioProgressFill.style.width = "0%";

    if (playImmediately) {
      playAudio();
    }
  }

  function playAudio() {
    initAudio();
    const playPromise = realAudioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlayingMusic = true;
        setPlayStateUI(true);
      }).catch(err => {
        console.warn("Local audio not found or playback blocked, trying fallback URL:", err);
        const track = tracks[currentTrackIdx];
        if (track.fallbackSrc && realAudioPlayer.src !== track.fallbackSrc) {
          realAudioPlayer.src = track.fallbackSrc;
          realAudioPlayer.play().then(() => {
            isPlayingMusic = true;
            setPlayStateUI(true);
          }).catch(() => {
            isPlayingMusic = false;
            setPlayStateUI(false);
          });
        } else {
          isPlayingMusic = false;
          setPlayStateUI(false);
        }
      });
    }
  }

  function pauseAudio() {
    realAudioPlayer.pause();
    isPlayingMusic = false;
    setPlayStateUI(false);
  }

  function setPlayStateUI(playing) {
    if (playing) {
      if (cdDisc) cdDisc.classList.add('spinning');
      if (equalizer) equalizer.classList.add('playing');
      if (btnPlayPause) {
        btnPlayPause.textContent = '[PAUSE]';
        btnPlayPause.style.background = '#00f5d4';
        btnPlayPause.style.color = '#000';
      }
    } else {
      if (cdDisc) cdDisc.classList.remove('spinning');
      if (equalizer) equalizer.classList.remove('playing');
      if (btnPlayPause) {
        btnPlayPause.textContent = '▶ PLAY';
        btnPlayPause.style.background = 'var(--neon-pink)';
        btnPlayPause.style.color = '#fff';
      }
    }
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      playSfx('click');
      if (isPlayingMusic) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  if (btnPrevTrack) {
    btnPrevTrack.addEventListener('click', () => {
      playSfx('click');
      loadTrack(currentTrackIdx - 1, isPlayingMusic);
    });
  }

  if (btnNextTrack) {
    btnNextTrack.addEventListener('click', () => {
      playSfx('click');
      loadTrack(currentTrackIdx + 1, isPlayingMusic);
    });
  }

  // Audio events: Time update & Scrubber fill
  realAudioPlayer.addEventListener('timeupdate', () => {
    if (trackCurrentTime) trackCurrentTime.textContent = formatTime(realAudioPlayer.currentTime);
    if (trackDuration && realAudioPlayer.duration) {
      trackDuration.textContent = formatTime(realAudioPlayer.duration);
    }
    if (audioProgressFill && realAudioPlayer.duration) {
      const pct = (realAudioPlayer.currentTime / realAudioPlayer.duration) * 100;
      audioProgressFill.style.width = `${pct}%`;
    }
  });

  realAudioPlayer.addEventListener('loadedmetadata', () => {
    if (trackDuration) trackDuration.textContent = formatTime(realAudioPlayer.duration);
  });

  // Track ended -> auto advance to next song
  realAudioPlayer.addEventListener('ended', () => {
    loadTrack(currentTrackIdx + 1, true);
  });

  // Click on progress bar to seek
  if (audioProgressBar) {
    audioProgressBar.addEventListener('click', (e) => {
      if (!realAudioPlayer.duration) return;
      const rect = audioProgressBar.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      realAudioPlayer.currentTime = clickPos * realAudioPlayer.duration;
    });
  }

  // Volume slider and mute toggle
  let lastVolume = 0.75;
  if (volIconBtn) {
    volIconBtn.style.cursor = 'pointer';
    volIconBtn.addEventListener('click', () => {
      if (realAudioPlayer.volume > 0) {
        lastVolume = realAudioPlayer.volume;
        realAudioPlayer.volume = 0;
        if (volumeSlider) volumeSlider.value = 0;
        volIconBtn.textContent = '[MUTE]';
      } else {
        const restoreVol = lastVolume > 0 ? lastVolume : 0.75;
        realAudioPlayer.volume = restoreVol;
        if (volumeSlider) volumeSlider.value = Math.round(restoreVol * 100);
        volIconBtn.textContent = restoreVol < 0.5 ? '[VOL-]' : '[VOL+]';
      }
      playSfx('click');
    });
  }

  if (volumeSlider) {
    realAudioPlayer.volume = volumeSlider.value / 100;
    volumeSlider.addEventListener('input', (e) => {
      const vol = e.target.value / 100;
      realAudioPlayer.volume = vol;
      if (volIconBtn) {
        volIconBtn.textContent = vol === 0 ? '[MUTE]' : (vol < 0.5 ? '[VOL-]' : '[VOL+]');
      }
    });
  }

  // Make rotation artist tags clickable to play artist track
  const artistTags = document.querySelectorAll('.artist-tag');
  artistTags.forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.title = `Play ${tag.textContent.trim()}`;
    tag.addEventListener('click', () => {
      const name = tag.textContent.trim().toLowerCase();
      const matchIdx = tracks.findIndex(t => t.artist.toLowerCase().includes(name));
      if (matchIdx !== -1) {
        loadTrack(matchIdx, true);
        playSfx('powerup');
      } else {
        playSfx('click');
      }
    });
  });

  // Load initial track
  loadTrack(0, false);

  /* ------------------------------------------------------------------------
     3. TOP BAR CONTROLS (SFX, CRT, STICKERS RESET)
     ------------------------------------------------------------------------ */
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnCrtToggle = document.getElementById('btn-crt-toggle');
  const btnResetStickers = document.getElementById('btn-reset-stickers');
  const crtOverlay = document.getElementById('crt-overlay');

  btnSoundToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    btnSoundToggle.querySelector('.btn-label').textContent = `SFX: ${sfxEnabled ? 'ON' : 'OFF'}`;
    btnSoundToggle.querySelector('.btn-icon').textContent = '[SFX]';
    if (!sfxEnabled && isPlayingMusic) {
      pauseAudio();
    }
  });

  btnCrtToggle.addEventListener('click', () => {
    playSfx('click');
    crtOverlay.classList.toggle('active');
    const isActive = crtOverlay.classList.contains('active');
    btnCrtToggle.querySelector('.btn-label').textContent = `CRT: ${isActive ? 'ON' : 'OFF'}`;
  });

  // Sound effect on all button hovers
  document.querySelectorAll('button, .neon-link-btn, .pokemon-slot, .web-button-badge').forEach(el => {
    el.addEventListener('mouseenter', () => playSfx('hover'));
  });

  /* ------------------------------------------------------------------------
     4. DRAGGABLE STICKERS PLAYGROUND
     ------------------------------------------------------------------------ */
  const draggableElements = document.querySelectorAll('[data-drag="true"]');
  const defaultPositions = [];

  draggableElements.forEach((el, i) => {
    defaultPositions.push({
      top: el.style.top,
      left: el.style.left,
      right: el.style.right,
      transform: el.style.transform
    });

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    function onStart(clientX, clientY) {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      
      const rect = el.getBoundingClientRect();
      initialLeft = rect.left + window.scrollX;
      initialTop = rect.top + window.scrollY;

      // Bring clicked sticker to top layer
      draggableElements.forEach(item => item.style.zIndex = '400');
      el.style.zIndex = '450';
      playSfx('click');
    }

    function onMove(clientX, clientY) {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
      el.style.right = 'auto';
    }

    function onEnd() {
      if (isDragging) {
        isDragging = false;
      }
    }

    // Mouse Events
    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) onMove(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', onEnd);

    // Touch Events
    el.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      onStart(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onEnd);
  });

  btnResetStickers.addEventListener('click', () => {
    playSfx('powerup');
    draggableElements.forEach((el, i) => {
      el.style.top = defaultPositions[i].top;
      el.style.left = defaultPositions[i].left;
      el.style.right = defaultPositions[i].right;
      el.style.transform = defaultPositions[i].transform;
    });
  });

  /* ------------------------------------------------------------------------
     5. POKÉMON DREAM TEAM PARTY INSPECTOR
     ------------------------------------------------------------------------ */
  const pkmnSlots = document.querySelectorAll('.pokemon-slot');
  const inspDex = document.getElementById('insp-dex');
  const inspName = document.getElementById('insp-name');
  const inspTypes = document.getElementById('insp-types');
  const inspSprite = document.getElementById('insp-big-sprite');
  const inspAbility = document.getElementById('insp-ability');
  const inspItem = document.getElementById('insp-item');
  const inspMoves = document.getElementById('insp-moves');
  const inspShinyToggle = document.getElementById('insp-shiny-toggle');

  let currentDex = '1000';
  let isCurrentShiny = false;

  function updateInspector(slot) {
    pkmnSlots.forEach(s => s.classList.remove('active'));
    slot.classList.add('active');

    currentDex = slot.dataset.dex;
    const name = slot.dataset.name;
    const types = slot.dataset.types;
    const ability = slot.dataset.ability;
    const item = slot.dataset.item;
    const moves = slot.dataset.moves.split(', ');

    inspDex.textContent = `#${currentDex.padStart(3, '0')}`;
    inspName.textContent = name.toUpperCase();
    inspTypes.textContent = types.toUpperCase();
    inspAbility.textContent = ability;
    inspItem.textContent = item;

    // Build moves tags
    inspMoves.innerHTML = moves.map(m => `<span class="move-pill">${m}</span>`).join('');

    // Update sprite URL
    isCurrentShiny = false;
    inspShinyToggle.classList.remove('active');
    inspSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${currentDex}.gif`;

    playSfx('cry');
  }

  pkmnSlots.forEach(slot => {
    slot.addEventListener('click', () => updateInspector(slot));
  });

  inspShinyToggle.addEventListener('click', () => {
    playSfx('powerup');
    isCurrentShiny = !isCurrentShiny;
    inspShinyToggle.classList.toggle('active', isCurrentShiny);
    
    if (isCurrentShiny) {
      inspSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${currentDex}.gif`;
    } else {
      inspSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${currentDex}.gif`;
    }
  });

  /* ------------------------------------------------------------------------
     6. SITE CUSTOMIZATION & DATA PERSISTENCE ENGINE
     ------------------------------------------------------------------------ */
  const DEFAULT_SITE_DATA = {
    profile: {
      name: "PONDS",
      handle: "@ihateuponds",
      avatar: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/10238.gif",
      tags: [
        { text: "[GHOST TRAINER]", color: "purple" },
        { text: "[SYS_ADMIN / NEET]", color: "pink" },
        { text: "[OPSEC / DEFENSE]", color: "cyan" }
      ],
      bio: "Welcome to my website :3 I go by Ponds online, Im from SC and Im in school for Cybersecurity. I love hyperpop, EDM, and metal music. Im pretty open to making friends but Im lowkey anxious as fuck so bare with me."
    },
    status: {
      mood: "Lowkey Anxious & Overstimulated",
      activity: "Playing Pokemon Modern Emerald",
      energyPercent: 0,
      energyLabel: "DEAD",
      currentQuote: '"I like shorts, they\'re comfy and easy to wear!"',
      quotes: [
        '"I like shorts, they\'re comfy and easy to wear!"',
        '"If the synth doesn\'t distort your headphones, it\'s not loud enough."',
        '"Gengar used Shadow Ball on my sleep schedule!"',
        '"Always disguise yourself like Mimikyu so haters can\'t reach you."',
        '"Hyperpop is just EDM with an energy drink and glitter on top."',
        '"Neocities is where the real internet lives. Keep it weird."',
        '"240 BPM is my natural resting heart rate."'
      ]
    },
    socials: [
      { name: "Discord (@ihateuponds)", url: "https://discord.com/users/ihateuponds", icon: "[DISCORD]", style: "discord-btn" },
      { name: "Instagram (s3ph1r0thxx)", url: "https://instagram.com/s3ph1r0thxx", icon: "[INSTA]", style: "instagram-btn" },
      { name: "Spotify (Heavy Rotation)", url: "https://open.spotify.com/user/fkm6bmojqqgf7j5eso4o0f9b0?si=cc74b10dd16d405c", icon: "[SPOTIFY]", style: "spotify-btn" },
      { name: "Steam (ihateuponds)", url: "https://steamcommunity.com/id/ihateuponds/", icon: "[STEAM]", style: "steam-btn" },
      { name: "StrawPage Portal", url: "https://ihateuponds.straw.page", icon: "[STRAW]", style: "strawpage-btn" },
      { name: "GitHub (@ihateuponds)", url: "https://github.com/ihateuponds", icon: "[GITHUB]", style: "github-btn" }
    ]
  };

  const AVATAR_PRESETS = [
    { name: "Shiny H-Zorua", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/10238.gif" },
    { name: "H-Zorua", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/10238.gif" },
    { name: "Gholdengo", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1000.gif" },
    { name: "Skeledirge", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/911.gif" },
    { name: "Mimikyu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/778.gif" },
    { name: "Shiny Mimikyu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/778.gif" },
    { name: "Dragapult", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/887.gif" },
    { name: "Annihilape", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/979.gif" },
    { name: "Shiny Gengar", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/94.gif" },
    { name: "Sableye", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/302.gif" }
  ];

  const SOCIAL_PRESETS = {
    instagram: { name: "Instagram (s3ph1r0thxx)", icon: "[INSTA]", style: "instagram-btn", defaultUrl: "https://instagram.com/s3ph1r0thxx" },
    discord: { name: "Discord (@ihateuponds)", icon: "[DISCORD]", style: "discord-btn", defaultUrl: "https://discord.com/users/ihateuponds" },
    spotify: { name: "Spotify (Heavy Rotation)", icon: "[SPOTIFY]", style: "spotify-btn", defaultUrl: "https://open.spotify.com/user/fkm6bmojqqgf7j5eso4o0f9b0?si=cc74b10dd16d405c" },
    steam: { name: "Steam (ihateuponds)", icon: "[STEAM]", style: "steam-btn", defaultUrl: "https://steamcommunity.com/id/ihateuponds/" },
    strawpage: { name: "StrawPage Portal", icon: "[STRAW]", style: "strawpage-btn", defaultUrl: "https://ihateuponds.straw.page" },
    neocities: { name: "Neocities Profile", icon: "[NEOCITIES]", style: "neocities-btn", defaultUrl: "https://neocities.org/site/ihateuponds" },
    twitter: { name: "Twitter / X", icon: "[TWITTER]", style: "twitter-btn", defaultUrl: "https://x.com" },
    youtube: { name: "YouTube", icon: "[YOUTUBE]", style: "youtube-btn", defaultUrl: "https://youtube.com" },
    twitch: { name: "Twitch", icon: "[TWITCH]", style: "twitch-btn", defaultUrl: "https://twitch.tv" },
    tiktok: { name: "TikTok", icon: "[TIKTOK]", style: "tiktok-btn", defaultUrl: "https://tiktok.com" },
    soundcloud: { name: "SoundCloud", icon: "[SOUNDCLOUD]", style: "soundcloud-btn", defaultUrl: "https://soundcloud.com" },
    tumblr: { name: "Tumblr", icon: "[TUMBLR]", style: "tumblr-btn", defaultUrl: "https://tumblr.com" },
    github: { name: "GitHub (@ihateuponds)", icon: "[GITHUB]", style: "github-btn", defaultUrl: "https://github.com/ihateuponds" },
    bluesky: { name: "Bluesky", icon: "[BLUESKY]", style: "bluesky-btn", defaultUrl: "https://bsky.app" },
    carrd: { name: "Carrd", icon: "[CARRD]", style: "carrd-btn", defaultUrl: "https://carrd.co" },
    custom: { name: "Custom Link", icon: "[LINK]", style: "custom-btn", defaultUrl: "https://" }
  };

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadSiteData() {
    try {
      const saved = localStorage.getItem('ponds_custom_site_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        let loadedSocials = Array.isArray(parsed.socials) && parsed.socials.length > 0 ? parsed.socials : DEFAULT_SITE_DATA.socials;

        // Auto-fix generic discord link if present from previous sessions
        loadedSocials = loadedSocials.map(s => {
          if (s.url === "https://discord.com" || s.url === "https://discord.gg") {
            return { ...s, url: "https://discord.com/users/ihateuponds", name: s.name.includes("@ihateuponds") ? s.name : "Discord (@ihateuponds)" };
          }
          return s;
        });

        // Ensure StrawPage and GitHub exist if they were not in older presets
        const hasStraw = loadedSocials.some(s => (s.url && s.url.includes("straw.page")) || (s.name && s.name.toLowerCase().includes("straw")));
        if (!hasStraw) {
          loadedSocials.push({ name: "StrawPage Portal", url: "https://ihateuponds.straw.page", icon: "[STRAW]", style: "strawpage-btn" });
        }
        const hasGithub = loadedSocials.some(s => (s.url && s.url.includes("github.com/ihateuponds")));
        if (!hasGithub) {
          loadedSocials.push({ name: "GitHub (@ihateuponds)", url: "https://github.com/ihateuponds", icon: "[GITHUB]", style: "github-btn" });
        }

        return {
          profile: { ...DEFAULT_SITE_DATA.profile, ...(parsed.profile || {}) },
          status: { ...DEFAULT_SITE_DATA.status, ...(parsed.status || {}) },
          socials: loadedSocials
        };
      }
    } catch (e) {
      console.warn("Could not load stored site data:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  }

  let siteData = loadSiteData();

  // DOM Elements for site content
  const heroAvatarImg = document.getElementById('hero-avatar-img');
  const heroNameText = document.getElementById('hero-name-text');
  const heroHandleText = document.getElementById('hero-handle-text');
  const heroTagsContainer = document.getElementById('hero-tags-container');
  const heroBioText = document.getElementById('hero-bio-text');
  
  const statusMoodEl = document.getElementById('status-mood');
  const statusActivityEl = document.getElementById('status-activity');
  const statusEnergyFill = document.getElementById('status-energy-fill');
  const statusQuote = document.getElementById('status-quote');
  const btnNewQuote = document.getElementById('btn-new-quote');
  const socialLinksGrid = document.getElementById('social-links-grid');

  function renderSiteData(data) {
    // 1. Profile Rendering
    if (heroAvatarImg && data.profile.avatar) {
      heroAvatarImg.src = data.profile.avatar;
    }
    if (heroNameText && data.profile.name) {
      heroNameText.textContent = data.profile.name;
      heroNameText.setAttribute('data-text', data.profile.name);
    }
    if (heroHandleText && data.profile.handle) {
      heroHandleText.textContent = data.profile.handle;
    }
    if (heroBioText && data.profile.bio) {
      heroBioText.textContent = data.profile.bio;
    }
    if (heroTagsContainer && Array.isArray(data.profile.tags)) {
      heroTagsContainer.innerHTML = data.profile.tags.map(t => 
        `<span class="accent-pill ${escapeHtml(t.color || 'purple')}">${escapeHtml(t.text)}</span>`
      ).join(' ');
    }

    // 2. Status & Mood Rendering
    if (statusMoodEl && data.status.mood) {
      statusMoodEl.textContent = data.status.mood;
    }
    if (statusActivityEl && data.status.activity) {
      statusActivityEl.textContent = data.status.activity;
    }
    if (statusEnergyFill) {
      const pct = Math.min(100, Math.max(0, parseInt(data.status.energyPercent, 10) || 0));
      const lbl = data.status.energyLabel || 'CHAOS';
      statusEnergyFill.style.width = `${pct}%`;
      statusEnergyFill.textContent = `${pct}% [${lbl}]`;
    }
    if (statusQuote) {
      statusQuote.textContent = data.status.currentQuote || (data.status.quotes && data.status.quotes[0]) || '';
    }

    // 3. Socials Rendering
    if (socialLinksGrid && Array.isArray(data.socials)) {
      socialLinksGrid.innerHTML = data.socials.map(s => `
        <a href="${escapeHtml(s.url || '#')}" target="_blank" rel="noopener" class="neon-link-btn ${escapeHtml(s.style || '')}">
          <span class="link-icon">${escapeHtml(s.icon || '[LINK]')}</span>
          <span class="link-name">${escapeHtml(s.name || 'Link')}</span>
          <span class="link-arrow">[CONNECT]</span>
        </a>
      `).join('');

      // Add hover sound effect to newly rendered link buttons
      socialLinksGrid.querySelectorAll('.neon-link-btn').forEach(el => {
        el.addEventListener('mouseenter', () => playSfx('hover'));
      });
    }

    // Add hover sound effects to all station portal links
    document.querySelectorAll('#site-portals-grid .neon-link-btn, .subpage-nav-bar .telemetry-link, .footer-subpages-nav a').forEach(el => {
      el.addEventListener('mouseenter', () => playSfx('hover'));
    });
  }

  // Initial DOM apply
  renderSiteData(siteData);

  /* ------------------------------------------------------------------------
     7. LIVE DIGITAL CLOCK & QUOTE ROLLER
     ------------------------------------------------------------------------ */
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    const now = new Date();
    if (clockEl) clockEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (btnNewQuote && statusQuote) {
    btnNewQuote.addEventListener('click', () => {
      playSfx('powerup');
      const quoteList = (siteData.status && siteData.status.quotes && siteData.status.quotes.length > 0) 
        ? siteData.status.quotes 
        : DEFAULT_SITE_DATA.status.quotes;
      const randomQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
      statusQuote.textContent = randomQuote;
      siteData.status.currentQuote = randomQuote;
      statusQuote.style.animation = 'none';
      void statusQuote.offsetWidth; // trigger reflow
      statusQuote.style.animation = 'glow-pulse 0.4s ease';
    });
  }

  /* ------------------------------------------------------------------------
     8. CUSTOMIZER MODAL TERMINAL ENGINE
     ------------------------------------------------------------------------ */
  const customizerModal = document.getElementById('customizer-modal');
  const btnCustomizerToggle = document.getElementById('btn-customizer-toggle');
  const btnModalClose = document.getElementById('btn-modal-close');
  const btnModalCancel = document.getElementById('btn-modal-cancel');
  const btnSaveApply = document.getElementById('btn-save-apply');

  // Tab navigation
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSfx('click');
      const targetTab = btn.dataset.tab;
      modalTabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');
    });
  });

  // Modal Inputs
  const cfgName = document.getElementById('cfg-name');
  const cfgHandle = document.getElementById('cfg-handle');
  const cfgAvatar = document.getElementById('cfg-avatar');
  const cfgAvatarPreview = document.getElementById('cfg-avatar-preview');
  const avatarPresetsGrid = document.getElementById('avatar-presets-grid');
  const cfgTagsList = document.getElementById('cfg-tags-list');
  const btnAddTag = document.getElementById('btn-add-tag');
  const cfgBio = document.getElementById('cfg-bio');

  const cfgMood = document.getElementById('cfg-mood');
  const cfgActivity = document.getElementById('cfg-activity');
  const cfgEnergy = document.getElementById('cfg-energy');
  const cfgEnergyDisplay = document.getElementById('cfg-energy-display');
  const cfgEnergyLabel = document.getElementById('cfg-energy-label');
  const cfgQuote = document.getElementById('cfg-quote');
  const cfgQuotesList = document.getElementById('cfg-quotes-list');
  const btnAddQuote = document.getElementById('btn-add-quote');

  const cfgSocialsList = document.getElementById('cfg-socials-list');
  const cfgNewSocialPreset = document.getElementById('cfg-new-social-preset');
  const btnAddSocial = document.getElementById('btn-add-social');

  const btnDownloadHtml = document.getElementById('btn-download-html');
  const btnCopyHtml = document.getElementById('btn-copy-html');
  const btnExportJson = document.getElementById('btn-export-json');
  const btnImportJsonTrigger = document.getElementById('btn-import-json-trigger');
  const cfgFileImport = document.getElementById('cfg-file-import');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  // Render Avatar Presets
  if (avatarPresetsGrid) {
    avatarPresetsGrid.innerHTML = AVATAR_PRESETS.map(p => `
      <button type="button" class="avatar-preset-btn" data-url="${escapeHtml(p.url)}">
        <img src="${escapeHtml(p.url)}" alt="${escapeHtml(p.name)}" />
        <span>${escapeHtml(p.name)}</span>
      </button>
    `).join('');

    avatarPresetsGrid.querySelectorAll('.avatar-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSfx('click');
        const url = btn.dataset.url;
        if (cfgAvatar) cfgAvatar.value = url;
        if (cfgAvatarPreview) cfgAvatarPreview.src = url;
      });
    });
  }

  // Update avatar preview when input changes
  if (cfgAvatar && cfgAvatarPreview) {
    cfgAvatar.addEventListener('input', () => {
      cfgAvatarPreview.src = cfgAvatar.value;
    });
  }

  // Energy Slider Live Value
  if (cfgEnergy && cfgEnergyDisplay) {
    cfgEnergy.addEventListener('input', () => {
      cfgEnergyDisplay.textContent = `${cfgEnergy.value}%`;
    });
  }

  // Render Tag Editor Item Rows
  function createTagRow(text = '', color = 'purple') {
    const row = document.createElement('div');
    row.className = 'tag-edit-row';
    row.innerHTML = `
      <input type="text" class="form-input tag-text-input" placeholder="Tag text (e.g. ⚡ Hyperpop)" value="${escapeHtml(text)}" style="flex: 1;" />
      <select class="form-select tag-color-select" style="width: 120px;">
        <option value="purple" ${color === 'purple' ? 'selected' : ''}>Purple</option>
        <option value="pink" ${color === 'pink' ? 'selected' : ''}>Pink</option>
        <option value="cyan" ${color === 'cyan' ? 'selected' : ''}>Cyan</option>
        <option value="yellow" ${color === 'yellow' ? 'selected' : ''}>Yellow</option>
        <option value="green" ${color === 'green' ? 'selected' : ''}>Green</option>
      </select>
      <button type="button" class="btn-delete-row" title="Delete tag">[X]</button>
    `;
    row.querySelector('.btn-delete-row').addEventListener('click', () => {
      playSfx('click');
      row.remove();
    });
    return row;
  }

  if (btnAddTag && cfgTagsList) {
    btnAddTag.addEventListener('click', () => {
      playSfx('click');
      cfgTagsList.appendChild(createTagRow('★ New Badge', 'pink'));
    });
  }

  // Render Quote Editor Item Rows
  function createQuoteRow(text = '') {
    const row = document.createElement('div');
    row.className = 'quote-edit-row';
    row.innerHTML = `
      <input type="text" class="form-input quote-text-input" placeholder="Enter quote..." value="${escapeHtml(text)}" style="flex: 1;" />
      <button type="button" class="btn-delete-row" title="Delete quote">[X]</button>
    `;
    row.querySelector('.btn-delete-row').addEventListener('click', () => {
      playSfx('click');
      row.remove();
    });
    return row;
  }

  if (btnAddQuote && cfgQuotesList) {
    btnAddQuote.addEventListener('click', () => {
      playSfx('click');
      cfgQuotesList.appendChild(createQuoteRow('"New vibe quote"'));
    });
  }

  // Render Social Link Item Rows
  function createSocialRow(item = { name: '', url: '', icon: '[LINK]', style: '' }) {
    const row = document.createElement('div');
    row.className = 'social-edit-row';
    row.dataset.style = item.style || '';
    row.innerHTML = `
      <input type="text" class="form-input social-icon-input" title="Icon Tag" value="${escapeHtml(item.icon || '[LINK]')}" />
      <input type="text" class="form-input social-name-input" placeholder="Platform Name" value="${escapeHtml(item.name || '')}" />
      <input type="text" class="form-input social-url-input" placeholder="https://..." value="${escapeHtml(item.url || '')}" />
      <button type="button" class="btn-delete-row" title="Delete social">[X]</button>
    `;
    row.querySelector('.btn-delete-row').addEventListener('click', () => {
      playSfx('click');
      row.remove();
    });
    return row;
  }

  if (btnAddSocial && cfgSocialsList && cfgNewSocialPreset) {
    btnAddSocial.addEventListener('click', () => {
      playSfx('click');
      const presetKey = cfgNewSocialPreset.value;
      const preset = SOCIAL_PRESETS[presetKey] || SOCIAL_PRESETS.custom;
      cfgSocialsList.appendChild(createSocialRow({
        name: preset.name,
        url: preset.defaultUrl,
        icon: preset.icon,
        style: preset.style
      }));
    });
  }

  // Populate Customizer Modal with current data
  function populateModalWithData(data) {
    if (cfgName) cfgName.value = data.profile.name || '';
    if (cfgHandle) cfgHandle.value = data.profile.handle || '';
    if (cfgAvatar) {
      cfgAvatar.value = data.profile.avatar || '';
      if (cfgAvatarPreview) cfgAvatarPreview.src = data.profile.avatar || '';
    }
    if (cfgBio) cfgBio.value = data.profile.bio || '';

    // Tags
    if (cfgTagsList) {
      cfgTagsList.innerHTML = '';
      (data.profile.tags || []).forEach(t => {
        cfgTagsList.appendChild(createTagRow(t.text, t.color));
      });
    }

    // Status
    if (cfgMood) cfgMood.value = data.status.mood || '';
    if (cfgActivity) cfgActivity.value = data.status.activity || '';
    if (cfgEnergy) {
      cfgEnergy.value = data.status.energyPercent || 90;
      if (cfgEnergyDisplay) cfgEnergyDisplay.textContent = `${cfgEnergy.value}%`;
    }
    if (cfgEnergyLabel) cfgEnergyLabel.value = data.status.energyLabel || 'CHAOS';
    if (cfgQuote) cfgQuote.value = data.status.currentQuote || '';

    // Quotes list
    if (cfgQuotesList) {
      cfgQuotesList.innerHTML = '';
      (data.status.quotes || []).forEach(q => {
        cfgQuotesList.appendChild(createQuoteRow(q));
      });
    }

    // Socials list
    if (cfgSocialsList) {
      cfgSocialsList.innerHTML = '';
      (data.socials || []).forEach(s => {
        cfgSocialsList.appendChild(createSocialRow(s));
      });
    }
  }

  /* ------------------------------------------------------------------------
     SECRET CREATOR MODE CONTROLLER
     ------------------------------------------------------------------------ */
  let creatorModeUnlocked = false;

  function showCreatorNotification(msg) {
    const toast = document.createElement('div');
    toast.className = 'creator-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 15);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  function unlockCreatorMode(silent = false) {
    if (!creatorModeUnlocked) {
      creatorModeUnlocked = true;
      if (btnCustomizerToggle) {
        btnCustomizerToggle.style.display = 'flex';
        btnCustomizerToggle.classList.remove('creator-hidden');
        btnCustomizerToggle.classList.add('creator-unlocked');
      }
      if (!silent) {
        playSfx('powerup');
        showCreatorNotification("★ CREATOR MODE UNLOCKED // PONDS.SYS ★");
      }
    }
  }

  function openCustomizerModal() {
    unlockCreatorMode(true);
    playSfx('powerup');
    populateModalWithData(siteData);
    customizerModal.classList.add('open');
    customizerModal.setAttribute('aria-hidden', 'false');
  }

  function closeCustomizerModal() {
    playSfx('click');
    customizerModal.classList.remove('open');
    customizerModal.setAttribute('aria-hidden', 'true');
  }

  if (btnCustomizerToggle) btnCustomizerToggle.addEventListener('click', openCustomizerModal);
  if (btnModalClose) btnModalClose.addEventListener('click', closeCustomizerModal);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closeCustomizerModal);

  // Close modal when clicking backdrop
  if (customizerModal) {
    customizerModal.addEventListener('click', (e) => {
      if (e.target === customizerModal) closeCustomizerModal();
    });
  }

  // 1. Keyboard Shortcut: Ctrl + Shift + E or Cmd + Shift + E
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault();
      unlockCreatorMode();
      openCustomizerModal();
    }
    if (e.key === 'Escape' && customizerModal && customizerModal.classList.contains('open')) {
      closeCustomizerModal();
    }
  });

  // 2. Secret URL Hash Trigger: #edit, #admin, #creator
  function checkUrlHash() {
    const hash = (window.location.hash || '').toLowerCase();
    if (hash === '#edit' || hash === '#admin' || hash === '#creator') {
      unlockCreatorMode(true);
      openCustomizerModal();
    }
  }
  window.addEventListener('hashchange', checkUrlHash);
  checkUrlHash();

  // 3. Secret Easter Egg Click: Double click the PONDS.SYS logo in top-left
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.style.cursor = 'pointer';
    navBrand.title = 'PONDS.SYS (Double click for Creator Mode)';
    navBrand.addEventListener('dblclick', () => {
      unlockCreatorMode();
      openCustomizerModal();
    });
  }

  // Save & Apply Changes
  if (btnSaveApply) {
    btnSaveApply.addEventListener('click', () => {
      // Gather profile tags
      const newTags = [];
      if (cfgTagsList) {
        cfgTagsList.querySelectorAll('.tag-edit-row').forEach(row => {
          const text = row.querySelector('.tag-text-input').value.trim();
          const color = row.querySelector('.tag-color-select').value;
          if (text) newTags.push({ text, color });
        });
      }

      // Gather quotes
      const newQuotes = [];
      if (cfgQuotesList) {
        cfgQuotesList.querySelectorAll('.quote-edit-row').forEach(row => {
          const text = row.querySelector('.quote-text-input').value.trim();
          if (text) newQuotes.push(text);
        });
      }

      // Gather socials
      const newSocials = [];
      if (cfgSocialsList) {
        cfgSocialsList.querySelectorAll('.social-edit-row').forEach(row => {
          const icon = row.querySelector('.social-icon-input').value.trim() || '[LINK]';
          const name = row.querySelector('.social-name-input').value.trim();
          const url = row.querySelector('.social-url-input').value.trim();
          const style = row.dataset.style || '';
          if (name && url) {
            newSocials.push({ name, url, icon, style });
          }
        });
      }

      // Build updated siteData object
      siteData = {
        profile: {
          name: cfgName ? cfgName.value.trim() || 'PONDS' : 'PONDS',
          handle: cfgHandle ? cfgHandle.value.trim() || '@ihateuponds' : '@ihateuponds',
          avatar: cfgAvatar ? cfgAvatar.value.trim() || DEFAULT_SITE_DATA.profile.avatar : DEFAULT_SITE_DATA.profile.avatar,
          tags: newTags.length > 0 ? newTags : DEFAULT_SITE_DATA.profile.tags,
          bio: cfgBio ? cfgBio.value.trim() || DEFAULT_SITE_DATA.profile.bio : DEFAULT_SITE_DATA.profile.bio
        },
        status: {
          mood: cfgMood ? cfgMood.value.trim() || '⚡ Overstimulated' : '⚡ Overstimulated',
          activity: cfgActivity ? cfgActivity.value.trim() || 'Hacking Neocities' : 'Hacking Neocities',
          energyPercent: cfgEnergy ? parseInt(cfgEnergy.value, 10) : 90,
          energyLabel: cfgEnergyLabel ? cfgEnergyLabel.value.trim() || 'CHAOS' : 'CHAOS',
          currentQuote: cfgQuote ? cfgQuote.value.trim() : (newQuotes[0] || DEFAULT_SITE_DATA.status.currentQuote),
          quotes: newQuotes.length > 0 ? newQuotes : DEFAULT_SITE_DATA.status.quotes
        },
        socials: newSocials.length > 0 ? newSocials : DEFAULT_SITE_DATA.socials
      };

      try {
        localStorage.setItem('ponds_custom_site_data', JSON.stringify(siteData));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      renderSiteData(siteData);
      closeCustomizerModal();
      playSfx('powerup');
    });
  }

  // Generate static updated index.html for export
  function generateUpdatedStaticHtml(data) {
    const tagsHtml = data.profile.tags.map(t => 
      `<span class="accent-pill ${escapeHtml(t.color)}">${escapeHtml(t.text)}</span>`
    ).join('\n            ');

    const socialsHtml = data.socials.map(s => 
      `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" class="neon-link-btn ${escapeHtml(s.style || '')}">\n` +
      `              <span class="link-icon">${escapeHtml(s.icon)}</span>\n` +
      `              <span class="link-name">${escapeHtml(s.name)}</span>\n` +
      `              <span class="link-arrow">↗</span>\n` +
      `            </a>`
    ).join('\n            ');

    // Clone the current full document HTML
    let fullHtml = document.documentElement.outerHTML;
    
    // Ensure the DOCTYPE is preserved
    if (!fullHtml.startsWith('<!DOCTYPE html>')) {
      fullHtml = '<!DOCTYPE html>\n' + fullHtml;
    }
    return fullHtml;
  }

  // Download Updated index.html
  if (btnDownloadHtml) {
    btnDownloadHtml.addEventListener('click', () => {
      playSfx('powerup');
      const htmlContent = generateUpdatedStaticHtml(siteData);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Copy Full HTML to Clipboard
  if (btnCopyHtml) {
    btnCopyHtml.addEventListener('click', () => {
      playSfx('powerup');
      const htmlContent = generateUpdatedStaticHtml(siteData);
      navigator.clipboard.writeText(htmlContent).then(() => {
        const textEl = btnCopyHtml.querySelector('.btn-main-text');
        const oldText = textEl ? textEl.textContent : 'COPY FULL HTML';
        if (textEl) textEl.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => {
          if (textEl) textEl.textContent = oldText;
        }, 1800);
      });
    });
  }

  // Export JSON Config
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      playSfx('powerup');
      const jsonStr = JSON.stringify(siteData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'neocities-site-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Import JSON Config
  if (btnImportJsonTrigger && cfgFileImport) {
    btnImportJsonTrigger.addEventListener('click', () => {
      cfgFileImport.click();
    });

    cfgFileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && parsed.profile && parsed.status && parsed.socials) {
            siteData = parsed;
            localStorage.setItem('ponds_custom_site_data', JSON.stringify(siteData));
            renderSiteData(siteData);
            populateModalWithData(siteData);
            playSfx('powerup');
            alert('Custom configuration successfully loaded!');
          } else {
            alert('Invalid config JSON structure.');
          }
        } catch (err) {
          alert('Could not parse JSON config file.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset to Defaults
  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all customizations back to original defaults?')) {
        playSfx('cry');
        siteData = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
        try {
          localStorage.removeItem('ponds_custom_site_data');
        } catch (e) {}
        renderSiteData(siteData);
        populateModalWithData(siteData);
      }
    });
  }

  /* ------------------------------------------------------------------------
     9. COPY 88x31 BUTTON CODE
     ------------------------------------------------------------------------ */
  const btnCopyCode = document.getElementById('btn-copy-code');
  const embedCodeArea = document.getElementById('embed-code-area');

  btnCopyCode.addEventListener('click', () => {
    playSfx('powerup');
    embedCodeArea.select();
    navigator.clipboard.writeText(embedCodeArea.value).then(() => {
      const originalText = btnCopyCode.textContent;
      btnCopyCode.textContent = 'COPIED!';
      btnCopyCode.style.background = 'var(--neon-cyan)';
      btnCopyCode.style.color = '#000';
      setTimeout(() => {
        btnCopyCode.textContent = originalText;
        btnCopyCode.style.background = 'var(--neon-purple)';
        btnCopyCode.style.color = '#fff';
      }, 1500);
    });
  });

  /* ------------------------------------------------------------------------
     10. SPARKLE CURSOR TRAIL & AMBIENT CANVAS BACKGROUND
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Background floating stars
  const stars = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.8 + 0.2,
    speed: Math.random() * 0.5 + 0.2,
    color: ['#9d4edd', '#ff007f', '#00f5d4', '#ffffff'][Math.floor(Math.random() * 4)]
  }));

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw background stars
    stars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) s.y = height;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  /* ------------------------------------------------------------------------
     8. POKÉMON TCG 3D CARD TILT & HOLOGRAPHIC SHINE ENGINE
     ------------------------------------------------------------------------ */
  const tcgCardItems = document.querySelectorAll('.tcg-card-item');
  tcgCardItems.forEach(item => {
    const wrapper = item.querySelector('.tcg-card-wrapper');
    const foil = item.querySelector('.tcg-holo-foil');
    if (!wrapper) return;

    item.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 3D tilt angle calculation
      const rotateX = ((y - centerY) / centerY) * -16;
      const rotateY = ((x - centerX) / centerX) * 16;

      wrapper.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`;

      if (foil) {
        const posX = ((x / rect.width) * 100).toFixed(1);
        const posY = ((y / rect.height) * 100).toFixed(1);
        foil.style.backgroundPosition = `${posX}% ${posY}%`;
      }
    });

    item.addEventListener('mouseleave', () => {
      wrapper.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (foil) {
        foil.style.backgroundPosition = '';
      }
    });
  });

  /* ------------------------------------------------------------------------
     9. UNIVERSAL LIGHTBOX MODAL (FOR POLAROIDS & TCG CARDS)
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-sub');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');

  function openLightbox(imgSrc, title, sub) {
    if (!lightboxModal) return;
    playSfx('powerup');
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxSub.textContent = sub;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    playSfx('click');
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  // Polaroid click listener
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const fullSrc = card.dataset.full || card.querySelector('img').src;
      const title = card.dataset.title || card.querySelector('.polaroid-title').textContent;
      const sub = card.dataset.sub || card.querySelector('.polaroid-date').textContent;
      openLightbox(fullSrc, title, sub);
    });
  });

  // TCG Card click listener
  tcgCardItems.forEach(card => {
    card.addEventListener('click', () => {
      const fullSrc = card.dataset.img || card.querySelector('img').src;
      const name = card.dataset.name || 'Pokemon Card';
      const set = card.dataset.set ? `${card.dataset.set} • ${card.dataset.rarity || ''}` : (card.dataset.rarity || '');
      openLightbox(fullSrc, name, set);
    });
  });

  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  /* ------------------------------------------------------------------------
     10. INDIEWEB TERMS & PRIVACY MODAL
     ------------------------------------------------------------------------ */
  const policyModal = document.getElementById('policy-modal');
  const btnOpenTerms = document.getElementById('btn-open-terms');
  const btnOpenPrivacy = document.getElementById('btn-open-privacy');
  const btnClosePolicy = document.getElementById('btn-close-policy');
  const policyTitle = document.getElementById('policy-title');

  function openPolicy(type) {
    if (!policyModal) return;
    playSfx('powerup');
    if (policyTitle) {
      policyTitle.textContent = type === 'privacy' 
        ? '★ NO-TRACK PRIVACY POLICY // INDIEWEB' 
        : '★ INDIEWEB TERMS OF SERVICE // PONDS.SYS';
    }
    policyModal.classList.add('active');
    policyModal.setAttribute('aria-hidden', 'false');
  }

  function closePolicy() {
    if (!policyModal) return;
    playSfx('click');
    policyModal.classList.remove('active');
    policyModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenTerms) {
    btnOpenTerms.addEventListener('click', () => openPolicy('terms'));
  }
  if (btnOpenPrivacy) {
    btnOpenPrivacy.addEventListener('click', () => openPolicy('privacy'));
  }
  if (btnClosePolicy) {
    btnClosePolicy.addEventListener('click', closePolicy);
  }
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicy();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) closeLightbox();
      if (policyModal && policyModal.classList.contains('active')) closePolicy();
    }
  });

  function checkHashPolicy() {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#terms-modal' || hash === '#terms') {
      openPolicy('terms');
    } else if (hash === '#privacy-modal' || hash === '#privacy') {
      openPolicy('privacy');
    }
  }
  window.addEventListener('hashchange', checkHashPolicy);
  checkHashPolicy();

  /* ------------------------------------------------------------------------
     POKÉMON BOOSTER PACK & BADGE CASE ENGINE
     ------------------------------------------------------------------------ */
  const BOOSTER_POOL = [
    { name: "Gengar VMAX (Alt Art)", set: "Fusion Strike #271", rarity: "Secret Rare Alt Art", tier: "SECRET RARE", img: "https://images.pokemontcg.io/swsh8/271_hires.png" },
    { name: "Umbreon VMAX (Moonbreon)", set: "Evolving Skies #215", rarity: "Special Secret Rare Alt Art", tier: "SECRET RARE", img: "https://images.pokemontcg.io/swsh7/215_hires.png" },
    { name: "Giratina V (Alt Art)", set: "Lost Origin #186", rarity: "Alternate Art Ultra Rare", tier: "ALT ART", img: "https://images.pokemontcg.io/swsh11/186_hires.png" },
    { name: "Rayquaza VMAX (Alt Art)", set: "Evolving Skies #218", rarity: "Secret Rare Alt Art", tier: "SECRET RARE", img: "https://images.pokemontcg.io/swsh7/218_hires.png" },
    { name: "Mewtwo & Mew GX", set: "Unified Minds #242", rarity: "Rainbow Secret Rare", tier: "RAINBOW RARE", img: "https://images.pokemontcg.io/sm11/242_hires.png" },
    { name: "Gholdengo ex (SIR)", set: "Paradox Rift #252", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv4/252_hires.png" },
    { name: "Skeledirge ex (SIR)", set: "Paldea Evolved #258", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv2/258_hires.png" },
    { name: "Sabrina Gengar", set: "Gym Heroes #14", rarity: "Vintage Holo Rare", tier: "VINTAGE HOLO", img: "https://images.pokemontcg.io/gym1/14_hires.png" },
    { name: "Charizard (Base Set Holo)", set: "Base Set #4", rarity: "Classic 1st Gen Holo", tier: "CLASSIC BASE", img: "https://images.pokemontcg.io/base1/4_hires.png" },
    { name: "Lugia V (Alt Art)", set: "Silver Tempest #186", rarity: "Alternate Art Ultra Rare", tier: "ALT ART", img: "https://images.pokemontcg.io/swsh12/186_hires.png" },
    { name: "Shining Magikarp", set: "Neo Revelation #66", rarity: "Secret Shining Rare", tier: "SHINING VINTAGE", img: "https://images.pokemontcg.io/neo3/66_hires.png" },
    { name: "Dark Gengar", set: "Neo Destiny #6", rarity: "Neo Vintage Holo", tier: "NEO VINTAGE", img: "https://images.pokemontcg.io/neo4/6_hires.png" },
    { name: "Dark Charizard", set: "Team Rocket #4", rarity: "Team Rocket Holo", tier: "TEAM ROCKET", img: "https://images.pokemontcg.io/base5/4_hires.png" },
    { name: "Tyranitar V (Sleepy Tyranitar)", set: "Battle Styles #155", rarity: "Alternate Art Ultra Rare", tier: "ALT ART", img: "https://images.pokemontcg.io/swsh5/155_hires.png" },
    { name: "Mew (Galarian Gallery)", set: "Crown Zenith #GG10", rarity: "Galarian Gallery Art Rare", tier: "ART RARE", img: "https://images.pokemontcg.io/swsh12pt5gg/GG10_hires.png" },
    { name: "Pikachu (Secret Rare)", set: "Crown Zenith #160", rarity: "Crown Zenith Secret Rare", tier: "SECRET RARE", img: "https://images.pokemontcg.io/swsh12pt5/160_hires.png" },
    { name: "Mimikyu (Trainer Gallery)", set: "Silver Tempest #TG16", rarity: "Trainer Gallery Holo", tier: "TRAINER GALLERY", img: "https://images.pokemontcg.io/swsh12tg/TG16_hires.png" },
    { name: "Chandelure (Trainer Gallery)", set: "Silver Tempest #TG04", rarity: "Trainer Gallery Holo", tier: "TRAINER GALLERY", img: "https://images.pokemontcg.io/swsh12tg/TG04_hires.png" },
    { name: "Aegislash (Illustration Rare)", set: "Paradox Rift #210", rarity: "Illustration Rare", tier: "ILLUS RARE", img: "https://images.pokemontcg.io/sv4/210_hires.png" },
    { name: "Espeon VMAX (Alt Art)", set: "Fusion Strike #270", rarity: "Secret Rare Alt Art", tier: "SECRET RARE", img: "https://images.pokemontcg.io/swsh8/270_hires.png" },
    { name: "Dragonite V (Alt Art)", set: "Evolving Skies #192", rarity: "Alternate Art Ultra Rare", tier: "ALT ART", img: "https://images.pokemontcg.io/swsh7/192_hires.png" },
    { name: "Alakazam ex (SIR)", set: "151 #201", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv3pt5/201_hires.png" },
    { name: "Zapdos ex (SIR)", set: "151 #202", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv3pt5/202_hires.png" },
    { name: "Charizard ex (SIR)", set: "151 #199", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv3pt5/199_hires.png" },
    { name: "Dark Dragonite", set: "Team Rocket #5", rarity: "Team Rocket Holo", tier: "TEAM ROCKET", img: "https://images.pokemontcg.io/base5/5_hires.png" },
    { name: "Sabrina Alakazam", set: "Gym Challenge #16", rarity: "Gym Holo Rare", tier: "GYM VINTAGE", img: "https://images.pokemontcg.io/gym2/16_hires.png" },
    { name: "Gengar & Mimikyu GX", set: "Team Up #165", rarity: "Alternate Art Tag Team GX", tier: "TAG TEAM GX", img: "https://images.pokemontcg.io/sm9/165_hires.png" },
    { name: "Roaring Moon ex (SIR)", set: "Paradox Rift #251", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "https://images.pokemontcg.io/sv4/251_hires.png" },
    { name: "Blastoise (Base Set Holo)", set: "Base Set #2", rarity: "Classic 1st Gen Holo", tier: "CLASSIC BASE", img: "https://images.pokemontcg.io/base1/2_hires.png" },
    { name: "Venusaur (Base Set Holo)", set: "Base Set #15", rarity: "Classic 1st Gen Holo", tier: "CLASSIC BASE", img: "https://images.pokemontcg.io/base1/15_hires.png" },
    { name: "Gengar (Gem Mint Chinese Full Art)", set: "Gem Pack Vol. 3 #0307/07", rarity: "Simplified Chinese Art Rare", tier: "CHINESE AR", img: "assets/cards/gengar-gem-pack-3.jpg" },
    { name: "Meowth ex (SIR)", set: "Perfect Order #121/088", rarity: "Special Illustration Rare", tier: "SPECIAL IR", img: "assets/cards/meowth-sir-por.png" }
  ];

  const btnRipBooster = document.getElementById('btn-rip-booster');
  const packPullsContainer = document.getElementById('pack-pulls-container');

  if (btnRipBooster && packPullsContainer) {
    btnRipBooster.addEventListener('click', () => {
      playSfx('powerup');

      let rips = 0;
      try {
        rips = parseInt(localStorage.getItem('ponds_booster_rips_count') || '0', 10) + 1;
        localStorage.setItem('ponds_booster_rips_count', rips);
      } catch(e) {}

      btnRipBooster.textContent = `★ PACK #${rips} OPENED! RIP ANOTHER? ★`;
      packPullsContainer.style.display = 'grid';
      packPullsContainer.innerHTML = '';

      // Pick 3 unique random cards from the 30-card pool
      const shuffled = [...BOOSTER_POOL].sort(() => 0.5 - Math.random());
      const pulls = shuffled.slice(0, 3);

      pulls.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'pulled-card';
        cardEl.style.cursor = 'pointer';
        cardEl.style.animation = `fadeInUp 0.3s ease forwards ${idx * 0.1}s`;
        cardEl.title = `Click to inspect ${card.name} in 3D Lightbox`;
        cardEl.innerHTML = `
          <div class="pulled-card-foil-wrap" style="position: relative; overflow: hidden; border-radius: 6px;">
            <img src="${card.img}" alt="${escapeHtml(card.name)}" loading="lazy" style="display: block; width: 100%; height: auto;" />
            <div class="pulled-card-shimmer" style="position: absolute; inset: 0; pointer-events: none; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);"></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 2px; margin-top: 6px;">
            <span class="pulled-card-name" style="font-family: var(--font-pixel); font-size: 0.62rem; color: #fff;">${escapeHtml(card.name)}</span>
            <span class="pulled-card-rarity" style="font-family: var(--font-terminal); font-size: 0.9rem; color: var(--neon-cyan);">${escapeHtml(card.tier || card.rarity)}</span>
          </div>
        `;
        cardEl.addEventListener('click', () => {
          openLightbox(card.img, card.name, `${card.set} • ${card.rarity}`);
        });
        packPullsContainer.appendChild(cardEl);
      });

      // Unlock Soul Badge
      unlockGymBadge('soul');
    });
  }

  // Gym Badges Management
  const BADGE_HINTS = {
    boulder: "BOULDER BADGE: Unlocked at station root!",
    cascade: "CASCADE BADGE: Earned by visiting Tech Support (/support/)!",
    thunder: "THUNDER BADGE: Earned by visiting Linux Bench (/rig/)!",
    rainbow: "RAINBOW BADGE: Earned by reading Operator Bio (/about/)!",
    soul: "SOUL BADGE: Earned by signing Guestbook or Ripping Booster Pack!",
    marsh: "MARSH BADGE: Earned by entering LSD Dream Realm (/lsd/)!",
    volcano: "VOLCANO BADGE: Earned by exploring Games Shrine (/games/)!",
    earth: "EARTH BADGE: Earned by browsing Post Archive (/posts/)!"
  };

  function getGymBadges() {
    try {
      return JSON.parse(localStorage.getItem('ponds_gym_badges') || '{"boulder": true}');
    } catch(e) {
      return { boulder: true };
    }
  }

  function unlockGymBadge(badgeName) {
    try {
      const badges = getGymBadges();
      badges[badgeName] = true;
      localStorage.setItem('ponds_gym_badges', JSON.stringify(badges));
      renderGymBadges();
    } catch(e) {}
  }

  function renderGymBadges() {
    const badges = getGymBadges();
    const slots = document.querySelectorAll('.gym-badge-slot');
    let count = 0;

    slots.forEach(slot => {
      const badgeKey = slot.dataset.badge;
      slot.style.cursor = 'pointer';
      if (badges[badgeKey]) {
        slot.classList.remove('locked');
        slot.classList.add('unlocked');
        count++;
      } else {
        slot.classList.add('locked');
        slot.classList.remove('unlocked');
      }

      // Remove existing listener clone
      slot.onclick = () => {
        if (badges[badgeKey]) {
          playSfx('badge');
          showCreatorNotification(`★ ${BADGE_HINTS[badgeKey] || badgeKey.toUpperCase()} ★`);
        } else {
          playSfx('click');
          showCreatorNotification(`[LOCKED] ${BADGE_HINTS[badgeKey] || 'Explore station to unlock!'}`);
        }
      };
    });

    const countText = document.getElementById('badge-count-text');
    if (countText) {
      countText.textContent = `UNLOCKED: ${count}/8`;
    }
  }

  // Initial badge check (always unlock boulder on root)
  unlockGymBadge('boulder');
  renderGymBadges();

  /* ------------------------------------------------------------------------
     STATION SHOUTBOX & CBOX LIVE CHAT ENGINE
     ------------------------------------------------------------------------ */
  const cboxFrame = document.getElementById('cbox-live-frame');
  const DEFAULT_CBOX_ID = '3560113';
  const DEFAULT_CBOX_TAG = '2LNz2J';

  function updateCboxFrame() {
    if (!cboxFrame) return;
    const boxId = localStorage.getItem('ponds_cbox_id') || DEFAULT_CBOX_ID;
    const boxTag = localStorage.getItem('ponds_cbox_tag') || DEFAULT_CBOX_TAG;
    cboxFrame.src = `https://www3.cbox.ws/box/?boxid=${encodeURIComponent(boxId)}&boxtag=${encodeURIComponent(boxTag)}`;
    cboxFrame.style.display = 'block';
  }

  updateCboxFrame();

  render();
});
