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
        copyEmbedBtn.textContent = "[OK] Copied to clipboard!";
        setTimeout(() => { copyEmbedBtn.textContent = originalText; }, 2500);
      } catch (err) {
        embedCode.select();
      }
    });
  }

  // 5. Triple Organic Eye Tracking Engine (Header Eyes + Giant Hypnotic Vortex Eye)
  const eyeList = [
    { eye: document.getElementById("eye-1"), iris: document.querySelector("#eye-1 .iris"), maxDist: 12 },
    { eye: document.getElementById("eye-2"), iris: document.querySelector("#eye-2 .iris"), maxDist: 12 },
    { eye: document.getElementById("giant-vortex-eye"), iris: document.getElementById("giant-iris"), maxDist: 22 }
  ];

  window.addEventListener("mousemove", (e) => {
    eyeList.forEach(({ eye, iris, maxDist }) => {
      if (!eye || !iris) return;
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(maxDist, Math.hypot(deltaX, deltaY) / 16);

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
      const nextDelay = Math.random() * 4000 + 2200;
      setTimeout(scheduleBlink, nextDelay);
    }, 160);
  }
  setTimeout(scheduleBlink, 2200);

  // 6. LSD Dream Simulator Dream Link Warp Engine
  const warpBtn = document.getElementById("btn-dream-warp");
  const dreamPrompt = document.querySelector(".lsd-dialogue-prompt");
  const dreamCoords = document.querySelector(".dream-coords");
  const graphStatus = document.getElementById("graph-status-text");

  const dreamRealms = [
    { coords: "[ SECTOR: 0X-SUN // CALCIFER RIG // GRAPH: UPPER-DYNAMIC ]", status: "DAY 042 // UPPER-DYNAMIC // DURATION: 04:20" },
    { coords: "[ SECTOR: 0X-MOON // DITHERED TEMPLE // GRAPH: DYNAMIC-LUCID ]", status: "DAY 077 // DYNAMIC-LUCID // DURATION: 01:12" },
    { coords: "[ SECTOR: 0X-KYOTO // OBSIDIAN GARDEN // GRAPH: DOWNER-STATIC ]", status: "DAY 128 // DOWNER-STATIC // DURATION: 08:44" },
    { coords: "[ SECTOR: 0X-NATURAL // HANGING STEPS // GRAPH: UPPER-FLASH ]", status: "DAY 256 // UPPER-FLASH // DURATION: 02:18" },
    { coords: "[ SECTOR: 0X-VOID // MONOLITH CORE // GRAPH: ULTRA-SURREAL ]", status: "DAY 512 // ULTRA-SURREAL // DURATION: 06:09" },
    { coords: "[ SECTOR: 0X-CHAOS // KALEIDOSCOPIC // GRAPH: FULL-ACID ]", status: "DAY 999 // FULL-ACID // DURATION: ∞" }
  ];
  let realmIdx = 0;

  function triggerDreamWarp() {
    // 1. Trigger Screen Warp Flash
    document.body.classList.remove("dream-warp-flash");
    void document.body.offsetWidth; // force reflow
    document.body.classList.add("dream-warp-flash");

    // 2. Shift Dream Coordinates
    realmIdx = (realmIdx + 1) % dreamRealms.length;
    const nextRealm = dreamRealms[realmIdx];

    if (dreamCoords) dreamCoords.textContent = nextRealm.coords;
    if (graphStatus) graphStatus.textContent = nextRealm.status;
    if (dreamPrompt) {
      dreamPrompt.textContent = "▶ WARPED TO: " + nextRealm.coords.split("//")[0].replace("[", "").trim();
      setTimeout(() => {
        dreamPrompt.textContent = "▶ TOUCH ANYWHERE TO LINK NEXT DREAM";
      }, 2500);
    }
  }

  if (warpBtn) warpBtn.addEventListener("click", triggerDreamWarp);
  if (dreamPrompt) dreamPrompt.addEventListener("click", triggerDreamWarp);

  // Allow clicking on any dream shard to trigger a brief surreal warp
  document.querySelectorAll(".dream-shard").forEach(shard => {
    shard.addEventListener("dblclick", triggerDreamWarp);
  });

  // Unlock Marsh Badge for visiting LSD Realm
  try {
    let badges = JSON.parse(localStorage.getItem("ponds_gym_badges") || "{}");
    badges["marsh"] = true;
    localStorage.setItem("ponds_gym_badges", JSON.stringify(badges));
  } catch(e) {}

})();
