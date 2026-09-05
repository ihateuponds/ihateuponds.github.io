(() => {
  const DISCORD_HANDLE = 'ihateuponds';
  const TIMEZONE = 'America/New_York';

  // Clock
  const clockEl = document.getElementById('clock-display');
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

  // Schedule Highlighter
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

  // Ticket Generator
  const form = document.getElementById('ticket-form');
  const outputBox = document.getElementById('ticket-output');
  const ticketCode = document.getElementById('ticket-code');
  const copyOutputBtn = document.getElementById('copy-output-btn');
  const copyOutputLabel = document.getElementById('copy-output-label');
  const errorBanner = document.getElementById('form-error-banner');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check (anti-bot trap)
      const honeypot = form.elements['b_trap'];
      if (honeypot && honeypot.value) {
        return;
      }

      // Rate limit check (anti-spam cooldown: 8 seconds)
      const nowTs = Date.now();
      const lastSubmit = sessionStorage.getItem('last_ticket_ts');
      if (lastSubmit && nowTs - parseInt(lastSubmit, 10) < 8000) {
        showError('Rate limit: Please wait a few seconds before generating another ticket.');
        return;
      }

      // Extract values
      const handle = form.elements['handle'].value.trim() || 'Anonymous';
      const os = form.elements['os'].value;
      const specs = form.elements['specs'].value.trim() || 'Not specified';
      const category = form.elements['category'].value;
      const summary = form.elements['summary'].value.trim();
      const logs = form.elements['logs'].value.trim() || 'None provided';

      // Validation
      clearErrors();
      let hasError = false;

      if (!os) {
        highlightError(form.elements['os'], 'Please select an operating system.');
        hasError = true;
      }
      if (!category) {
        highlightError(form.elements['category'], 'Please select an issue category.');
        hasError = true;
      }
      if (!summary || summary.length < 15) {
        highlightError(form.elements['summary'], 'Please provide at least 15 characters describing the issue.');
        hasError = true;
      }

      if (hasError) return;

      // Generate Ticket ID & Timestamp
      const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(now);

      const ticketText = [
        `════════════════════════════════════════`,
        `[TECH SUPPORT TICKET] #${ticketId}`,
        `Filed: ${timeStr} EDT`,
        `════════════════════════════════════════`,
        `CLIENT:   ${handle}`,
        `OS:       ${os}`,
        `HARDWARE: ${specs}`,
        `CATEGORY: ${category}`,
        `════════════════════════════════════════`,
        `DESCRIPTION:`,
        `${summary}`,
        ``,
        `ERROR LOGS / CODES:`,
        `${logs}`,
        `════════════════════════════════════════`
      ].join('\n');

      ticketCode.textContent = ticketText;
      outputBox.hidden = false;
      outputBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Save submission timestamp
      sessionStorage.setItem('last_ticket_ts', nowTs.toString());

      // Auto-copy to clipboard
      await copyToClipboard(ticketText);
    });
  }

  function highlightError(field, msg) {
    field.classList.add('has-error');
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.hidden = false;
    }
    field.focus();
  }

  function clearErrors() {
    if (form) {
      form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    }
    if (errorBanner) {
      errorBanner.textContent = '';
      errorBanner.hidden = true;
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      if (copyOutputBtn) {
        copyOutputBtn.classList.add('copied');
        copyOutputLabel.textContent = '✓ Copied Ticket to Clipboard';
        setTimeout(() => {
          copyOutputBtn.classList.remove('copied');
          copyOutputLabel.textContent = 'Copy Ticket Again';
        }, 3000);
      }
    } catch (err) {
      if (copyOutputLabel) {
        copyOutputLabel.textContent = 'Copy Ticket Again';
      }
    }
  }

  if (copyOutputBtn) {
    copyOutputBtn.addEventListener('click', () => {
      const text = ticketCode.textContent;
      if (text) copyToClipboard(text);
    });
  }

  function showError(msg) {
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.hidden = false;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
  markToday();
})();
