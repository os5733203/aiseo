
/* OS SEO custom chatbot — n8n remains the response engine. */
(() => {
  'use strict';
  const ENDPOINT = 'https://osseo-omar.app.n8n.cloud/webhook/a3d65094-0558-4d03-95de-255615af950d/chat';
  if (document.getElementById('osseo-chat-root')) return;
  const icons = {
    chat:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l1.1-4.2A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 11h8M8 14h5"/></svg>',
    close:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12 16-8-5 16-3-7-8-1Z"/></svg>',
    wa:'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 11.5a8 8 0 0 1-12 6.9L4 20l1.7-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9c.6 2.6 2 4 4.5 5l1.3-1.3 2 1.1c-.3 1.7-1.3 2.4-2.8 2.1-3.2-.6-6.1-3.5-6.8-6.7C7 7.8 7.8 7 9 7l1 2-1 0Z"/></svg>'
  };
  const root = document.createElement('div');
  root.id = 'osseo-chat-root';
  root.innerHTML = `
    <button id="osseo-chat-launcher" type="button" aria-label="Open OS SEO assistant" aria-expanded="false" aria-controls="osseo-chat-window"><span class="oc-launcher-logo-shell"><img src="/images/os-seo-logo-mark.png" alt="" class="oc-launcher-logo" loading="eager" decoding="async"></span><span class="oc-status"></span></button>
    <section id="osseo-chat-window" role="dialog" aria-label="OS SEO assistant" aria-modal="false" aria-hidden="true">
      <div class="oc-head">
        <div class="oc-avatar" aria-hidden="true"><img src="/images/os-seo-logo-mark.png" alt="" class="oc-header-logo" decoding="async"></div>
        <div class="oc-head-copy"><div class="oc-head-title">OS SEO Assistant</div><div class="oc-head-sub">AI-powered • SEO, GEO & AEO</div></div>
        <button type="button" class="oc-icon-btn oc-audio-btn" id="osseo-chat-sound" aria-label="Mute notification sound" aria-pressed="true" title="Notification sound">♪</button>
        <button type="button" class="oc-icon-btn" id="osseo-chat-close" aria-label="Close chat">${icons.close}</button>
      </div>
      <div class="oc-chat-body" id="osseo-chat-body" role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions">
        <p class="oc-time-label">OS SEO • Digital Growth</p>
        <div class="oc-bubble oc-bot" dir="auto">👋 Welcome to OS SEO!<\u0062r>How can we help you grow your business today?</div>
        <div class="oc-quick" id="osseo-chat-quick">
          <button type="button" data-prompt="I need Local SEO for my business.">📍 Local SEO</button>
          <button type="button" data-prompt="I'd like a technical SEO audit.">🔎 SEO Audit</button>
          <button type="button" data-prompt="I need a modern website for my business.">💻 Websites</button>
          <button type="button" data-prompt="How can GEO and AEO improve my AI search visibility?">✨ GEO & AEO</button>
        </div>
      </div>
      <div class="oc-footer">
        <form id="osseo-chat-form" class="oc-input-row">
          <textarea id="osseo-chat-input" rows="1" maxlength="1800" placeholder="Ask anything… / اسألنا هنا" aria-label="Your message"></textarea>
          <button id="osseo-chat-send" type="submit" aria-label="Send message">${icons.send}</button>
        </form>
        <div class="oc-bottom-line"><a class="oc-whatsapp" href="https://wa.me/201221403257?text=Hello%20OS%20SEO%2C%20I%20would%20like%20to%20discuss%20my%20website." target="_blank" rel="noopener noreferrer">${icons.wa} Chat on WhatsApp</a><span>Powered by OS SEO AI</span></div>
      </div>
    </section>`;
  // Remove intentional escaped break; keep the initial welcome text plain and safe.
  const welcome = root.querySelector('.oc-bubble');
  welcome.textContent = '👋 Welcome to OS SEO!\nHow can we help you grow your business today?';
  document.body.appendChild(root);
  const $ = (id) => root.querySelector('#' + id);
  const launcher = $('osseo-chat-launcher');
  const windowEl = $('osseo-chat-window');
  const close = $('osseo-chat-close');
  const body = $('osseo-chat-body');
  const form = $('osseo-chat-form');
  const input = $('osseo-chat-input');
  const send = $('osseo-chat-send');
  const soundBtn = $('osseo-chat-sound');
  let soundOn = true;
  let audioContext = null;
  function updateAudioButtons() {
    soundBtn.textContent = soundOn ? '♪' : '♩';
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.setAttribute('aria-label', soundOn ? 'Mute notification sound' : 'Enable notification sound');
    soundBtn.title = soundOn ? 'Mute notification sound' : 'Enable notification sound';

  }
  // The notification is synthesized locally: no paid service or audio downloads.
  function unlockAudio() {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    } catch (_) { /* Browser may block audio. */ }
  }
  function playNotification() {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const start = audioContext.currentTime + 0.02;
      [740, 980].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const t = start + index * 0.11;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.045, t + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(t);
        oscillator.stop(t + 0.19);
      });
    } catch (_) { /* Audio may be blocked by browser permissions. */ }
  }
  soundBtn.addEventListener('click', () => { soundOn = !soundOn; if (soundOn) unlockAudio(); updateAudioButtons(); });

  updateAudioButtons();

  let busy = false;
  let sessionId;
  try {
    sessionId = sessionStorage.getItem('osseoChatSessionId');
    if (!sessionId) {
      sessionId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : 'osseo-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      sessionStorage.setItem('osseoChatSessionId', sessionId);
    }
  } catch (_) { sessionId = 'osseo-' + Date.now() + '-' + Math.random().toString(36).slice(2); }
  const services = [
    {test:/local seo|google business|maps|محلي|خرائط|نشاطي التجاري/i,title:'Local SEO',description:'Get found by nearby customers on Google Search & Maps.',image:'/images/hero-editorial-hospitality-1200.webp',url:'/services/local-seo/'},
    {test:/technical|audit|تدقيق|تقني|سرعة|فهرسة/i,title:'Technical SEO Audit',description:'Improve crawlability, indexing and site performance.',image:'/images/hero-editorial-studio-1200.webp',url:'/services/technical-seo-audit/'},
    {test:/web ?design|website|web development|موقع|تصميم|متجر/i,title:'Website Development',description:'Fast, modern websites designed to convert.',image:'/images/hero-editorial-tailoring-1200.webp',url:'/services/website-development/'},
    {test:/geo|aeo|ai search|chatgpt|ذكاء اصطناعي|محركات الإجابة/i,title:'GEO & AEO',description:'Make your brand easier to discover in AI search.',image:'/images/hero-editorial-studio-1200.webp',url:'/services/geo/'}
  ];
  function toggle(force) {
    const open = typeof force === 'boolean' ? force : !windowEl.classList.contains('oc-open');
    windowEl.classList.toggle('oc-open', open);
    windowEl.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close OS SEO assistant' : 'Open OS SEO assistant');
    if (open) { input.focus({preventScroll:true}); scroll(); } else { launcher.focus({preventScroll:true}); }
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function bubble(text, sender) {
    const el = document.createElement('div');
    el.className = 'oc-bubble ' + (sender === 'user' ? 'oc-user' : 'oc-bot');
    el.setAttribute('dir', 'auto');
    el.textContent = String(text);
    body.appendChild(el);
    scroll();
    return el;
  }
  function card(service) {
    const el = document.createElement('div');
    el.className = 'oc-service-card';
    const img = document.createElement('img');
    img.src = service.image; img.alt = service.title + ' service'; img.loading = 'lazy';
    const content = document.createElement('div'); content.className = 'oc-service-content';
    const title = document.createElement('strong'); title.textContent = service.title;
    const description = document.createElement('p'); description.textContent = service.description;
    const link = document.createElement('a'); link.href = service.url;
    link.textContent = 'Explore service →'; link.setAttribute('aria-label', 'Explore ' + service.title);
    content.append(title, description, link); el.append(img, content); body.appendChild(el); scroll();
  }
  function typing() {
    const el = document.createElement('div');
    el.className = 'oc-typing'; el.setAttribute('aria-label', 'Assistant is typing');
    for (let i=0;i<3;i++) el.appendChild(document.createElement('span'));
    body.appendChild(el); scroll(); return el;
  }
  async function submit(message) {
    const text = String(message || '').trim();
    if (!text || busy) return;
    unlockAudio();
    busy = true; send.disabled = true; input.value = '';
    input.style.height = ''; $('osseo-chat-quick')?.remove();
    bubble(text, 'user');
    const typingEl = typing();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      let response;
      try {
        response = await fetch(ENDPOINT, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'sendMessage',sessionId,chatInput:text}),signal:controller.signal});
      } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error('n8n returned ' + response.status);
      const data = await response.json();
      const item = Array.isArray(data) ? data[0] : data;
      const reply = typeof item === 'string' ? item : (item && (item.output || item.text || item.message || item.reply));
      if (typeof reply !== 'string' || !reply.trim()) throw new Error('Missing reply');
      typingEl.remove(); bubble(reply, 'bot');
      playNotification();
      const match = services.find(s => s.test.test(text));
      if (match) card(match);
    } catch (error) {
      typingEl.remove();
      const ar = /[\u0600-\u06FF]/.test(text);
      bubble(ar ? 'عذرًا، حصلت مشكلة في الاتصال. حاول مرة تانية أو تواصل معنا على واتساب.' : 'Sorry, the assistant is temporarily unavailable. Please try again or reach us on WhatsApp.', 'bot');
      console.warn('OS SEO chat request failed:', error);
    } finally { busy = false; send.disabled = false; input.focus({preventScroll:true}); scroll(); }
  }
  launcher.addEventListener('click', () => { unlockAudio(); toggle(); });
  close.addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && windowEl.classList.contains('oc-open')) toggle(false); });
  form.addEventListener('submit', e => { e.preventDefault(); submit(input.value); });
  input.addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(input.value); } });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight,104) + 'px'; });
  $('osseo-chat-quick').addEventListener('click', e => { const button = e.target.closest('button[data-prompt]'); if(button) submit(button.dataset.prompt); });
})();
