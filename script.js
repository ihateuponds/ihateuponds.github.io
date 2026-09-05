(() => {
  const DISCORD_HANDLE = 'ihateuponds';
  const TIMEZONE = 'America/New_York';

  const clockEl = document.getElementById('clock-display');
  const copyBtn = document.getElementById('copy-discord-btn');
  const copyLabel = document.getElementById('copy-btn-label');

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    clockEl.textContent = formatter.format(now);
  }

  function markToday() {
    const now = new Date();
    const nyDateStr = now.toLocaleDateString('en-CA', { timeZone: TIMEZONE });
    const targetRow = document.querySelector(`[data-date="${nyDateStr}"]`);

    if (targetRow) {
      targetRow.classList.add('is-today');
      const chip = targetRow.querySelector('.today-chip');
      if (chip) chip.hidden = false;
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(DISCORD_HANDLE);
        copyBtn.classList.add('copied');
        copyLabel.textContent = `Copied "${DISCORD_HANDLE}" to clipboard`;

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyLabel.textContent = `Copy Discord: ${DISCORD_HANDLE}`;
        }, 2200);
      } catch (err) {
        prompt('Copy manually:', DISCORD_HANDLE);
      }
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
  markToday();
})();
