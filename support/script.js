(() => {
  const TIMEZONE = "America/New_York";

  // Tab Navigation Engine
  const tabs = Array.from(document.querySelectorAll(".tui-tab"));
  const panes = Array.from(document.querySelectorAll(".tui-pane"));

  function switchTab(targetId) {
    tabs.forEach(tab => {
      const isTarget = tab.getAttribute("data-tab") === targetId;
      tab.classList.toggle("active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    panes.forEach(pane => {
      const isTarget = pane.id === targetId;
      pane.classList.toggle("active", isTarget);
      pane.hidden = !isTarget;
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      if (targetId) switchTab(targetId);
    });
  });

  // Cross-link buttons inside panes
  document.querySelectorAll(".switch-to-ticket-btn").forEach(btn => {
    btn.addEventListener("click", () => switchTab("pane-ticket"));
  });

  // Keyboard Shortcuts for TUI navigation (1, 2, 3)
  window.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const isTyping = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
    if (isTyping) return;

    if (e.key === "1") switchTab("pane-schedule");
    else if (e.key === "2") switchTab("pane-ticket");
    else if (e.key === "3") switchTab("pane-specs");
  });

  // Live Telemetry Clock (EDT)
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

  // Dynamic Schedule Row Highlighter
  function markTodayRow() {
    const now = new Date();
    const nyDateStr = now.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
    const targetRow = document.querySelector(`tr[data-date="${nyDateStr}"]`);

    if (targetRow) {
      targetRow.classList.add("is-today");
      const badge = targetRow.querySelector(".badge-today");
      if (badge) badge.hidden = false;
    }
  }

  // Ticket Intake & Compiler System
  const form = document.getElementById("ticket-form");
  const outputBox = document.getElementById("ticket-output");
  const ticketCode = document.getElementById("ticket-code");
  const copyOutputBtn = document.getElementById("copy-output-btn");
  const copyOutputLabel = document.getElementById("copy-output-label");
  const errorBanner = document.getElementById("form-error-banner");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Bot honeypot verification
      const botTrap = form.elements["b_trap"];
      if (botTrap && botTrap.value) return;

      // Rate limit cooldown (8 seconds)
      const nowTs = Date.now();
      const lastSubmit = sessionStorage.getItem("last_ticket_ts");
      if (lastSubmit && nowTs - parseInt(lastSubmit, 10) < 8000) {
        showError("Rate limit: Please wait a few seconds before generating another ticket.");
        return;
      }

      // Input Extraction
      const handle = form.elements["handle"].value.trim() || "Anonymous";
      const os = form.elements["os"].value;
      const category = form.elements["category"].value;
      const specs = form.elements["specs"].value.trim() || "Not specified";
      const summary = form.elements["summary"].value.trim();
      const logs = form.elements["logs"].value.trim() || "None provided";

      // Form Validation
      clearErrors();
      let hasError = false;

      if (!os) {
        highlightError(form.elements["os"], "Please select an operating system.");
        hasError = true;
      }
      if (!category) {
        highlightError(form.elements["category"], "Please select an issue classification.");
        hasError = true;
      }
      if (!summary || summary.length < 15) {
        highlightError(form.elements["summary"], "Please provide at least 15 characters describing the issue.");
        hasError = true;
      }

      if (hasError) return;

      // Generate Ticket ID and timestamp
      const ticketId = "TKT-" + Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("en-US", {
        timeZone: TIMEZONE,
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(now);

      const ticketLines = [
        "============================================================",
        `[TECH SUPPORT TICKET] #${ticketId}`,
        `Filed: ${timeStr} EDT`,
        "============================================================",
        `CLIENT:    ${handle}`,
        `OS:        ${os}`,
        `HARDWARE:  ${specs}`,
        `CATEGORY:  ${category}`,
        "------------------------------------------------------------",
        "ISSUE SUMMARY & REPRODUCTION:",
        summary,
        "",
        "DIAGNOSTIC LOGS / ERROR TRACES:",
        logs,
        "============================================================"
      ];

      const ticketText = ticketLines.join("\n");

      ticketCode.textContent = ticketText;
      outputBox.hidden = false;
      outputBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

      sessionStorage.setItem("last_ticket_ts", nowTs.toString());
      await copyToClipboard(ticketText);
    });
  }

  function highlightError(element, msg) {
    element.classList.add("has-error");
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.hidden = false;
    }
    element.focus();
  }

  function clearErrors() {
    if (form) {
      form.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));
    }
    if (errorBanner) {
      errorBanner.textContent = "";
      errorBanner.hidden = true;
    }
  }

  function showError(msg) {
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.hidden = false;
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (copyOutputBtn && copyOutputLabel) {
        copyOutputBtn.classList.add("copied");
        copyOutputLabel.textContent = "[OK] Copied Ticket to Clipboard";
        setTimeout(() => {
          copyOutputBtn.classList.remove("copied");
          copyOutputLabel.textContent = "Copy Ticket Again";
        }, 3000);
      }
    } catch (err) {
      if (copyOutputLabel) {
        copyOutputLabel.textContent = "Copy Ticket Again";
      }
    }
  }

  if (copyOutputBtn) {
    copyOutputBtn.addEventListener("click", () => {
      const text = ticketCode.textContent;
      if (text) copyToClipboard(text);
    });
  }

  // Initialization
  updateClock();
  setInterval(updateClock, 1000);
  markTodayRow();
})();
