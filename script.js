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

  // 2. Retro Font Mode Switcher
  const fontBtn = document.getElementById("font-toggle-btn");
  const body = document.getElementById("page-body");
  const fontOptions = [
    { name: "vga", family: "'IBMVGA', monospace" },
    { name: "bios", family: "'IBMBios', monospace" },
    { name: "mono", family: "'JetBrains Mono', monospace" },
    { name: "pixel", family: "'VT323', monospace" }
  ];
  let currentFontIdx = 0;

  if (fontBtn && body) {
    fontBtn.addEventListener("click", () => {
      currentFontIdx = (currentFontIdx + 1) % fontOptions.length;
      body.style.fontFamily = fontOptions[currentFontIdx].family;
      fontBtn.textContent = "font: " + fontOptions[currentFontIdx].name;
    });
  }

  // 3. Favorite Games Shrine Inspector
  const gameSlots = document.querySelectorAll(".game-card-slot");
  const inspectGameTitle = document.getElementById("inspect-game-title");
  const inspectGamePlat = document.getElementById("inspect-game-plat");
  const inspectGameNote = document.getElementById("inspect-game-note");

  gameSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      gameSlots.forEach(s => s.classList.remove("active"));
      slot.classList.add("active");

      if (inspectGameTitle) inspectGameTitle.textContent = slot.getAttribute("data-title");
      if (inspectGamePlat) inspectGamePlat.textContent = slot.getAttribute("data-platform");
      if (inspectGameNote) inspectGameNote.textContent = slot.getAttribute("data-note");
    });
  });

  // 4. Copy Embed Snippet
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

  // 5. Organic Blinking Eyeballs Engine (LSD Dream Simulator / Weirdcore)
  const eyeList = [
    { eye: document.getElementById("eye-1"), iris: document.querySelector("#eye-1 .iris") },
    { eye: document.getElementById("eye-2"), iris: document.querySelector("#eye-2 .iris") }
  ];

  window.addEventListener("mousemove", (e) => {
    eyeList.forEach(({ eye, iris }) => {
      if (!eye || !iris) return;
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(12, Math.hypot(deltaX, deltaY) / 18);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      iris.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  function scheduleBlink() {
    eyeList.forEach(({ eye }) => {
      if (eye) eye.classList.add("blinking");
    });
    setTimeout(() => {
      eyeList.forEach(({ eye }) => {
        if (eye) eye.classList.remove("blinking");
      });
      const nextDelay = Math.random() * 4000 + 2500;
      setTimeout(scheduleBlink, nextDelay);
    }, 160);
  }
  setTimeout(scheduleBlink, 2500);

  // 6. LSD Dream Simulator Dream Link Rotator
  const lsdPrompt = document.querySelector(".lsd-dialogue-prompt");
  const dreamCoords = document.querySelector(".dream-coords");
  const dreamSectors = [
    "[ SECTOR: 0X-LIMINAL // CALCIFER RIG // DREAM LEVEL: DEEP ]",
    "[ SECTOR: 0X-SUN // MONUMENT BLOCKS // DREAM LEVEL: STATIC ]",
    "[ SECTOR: 0X-MOON // DITHERED VOID // DREAM LEVEL: LUCID ]",
    "[ SECTOR: 0X-KYOTO // OBSIDIAN GARDEN // DREAM LEVEL: REM ]",
    "[ SECTOR: 0X-NATURAL // THE HANGING STEPS // DREAM LEVEL: FLASH ]"
  ];
  let sectorIdx = 0;

  if (lsdPrompt && dreamCoords) {
    lsdPrompt.style.cursor = "pointer";
    lsdPrompt.addEventListener("click", () => {
      sectorIdx = (sectorIdx + 1) % dreamSectors.length;
      dreamCoords.textContent = dreamSectors[sectorIdx];
      lsdPrompt.textContent = "▶ LINKED! SECTOR SHIFTED: " + dreamSectors[sectorIdx].split("//")[0].replace("[", "").trim();
      setTimeout(() => {
        lsdPrompt.textContent = "▶ TOUCH ANYWHERE TO LINK NEXT DREAM";
      }, 2000);
    });
  }

})();
