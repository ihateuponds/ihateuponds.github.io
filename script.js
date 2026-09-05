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

  // 5. Favorite Games Shrine Inspector
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
