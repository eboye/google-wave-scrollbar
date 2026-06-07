/**
 * <wave-scroll> — a modern reimagining of the Google Wave scrollbar (2010 → 2026).
 *
 * A zero-dependency Web Component. Content scrolls natively (keyboard, touch,
 * momentum, find-in-page all keep working); a thin glass overlay scrollbar is
 * drawn on top and the native bar is hidden.
 *
 * CSS-first: the resting grabber position is driven entirely by CSS
 * scroll-driven animations (`scroll-timeline` / `animation-timeline`), so the
 * common case (wheel / trackpad / keyboard scrolling) costs zero JS on the hot
 * path. JavaScript only handles the three things CSS genuinely can't express —
 * the original Wave signatures:
 *
 *   1. drag the grabber to scroll
 *   2. click the arrows to step-scroll
 *   3. the "delayed dragger": after an arrow click the grabber stays put and a
 *      thin indicator shows where you're heading; the grabber glides over once
 *      the pointer leaves.
 *
 * Attributes:
 *   accent="#rrggbb"   theme color (also: --wave-accent CSS custom property)
 *   auto-hide          only reveal the bar on hover / interaction
 *   no-arrows          hide the up/down arrow buttons
 *
 * @author  rebuilt 2026
 * @license MIT
 */

// Feature-detect CSS scroll-driven animations. When present, the grabber and
// indicator track the scroll position purely in CSS. When absent (older
// engines), we fall back to a rAF-throttled scroll listener.
const NATIVE_TIMELINE =
  typeof CSS !== 'undefined' &&
  CSS.supports?.('animation-timeline', 'scroll()') &&
  CSS.supports?.('timeline-scope', '--x');

const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)');

const STYLES = /* css */ `
  :host {
    /* Public theming knobs */
    --wave-accent: #6366f1;
    --wave-track-inset: 6px;
    --wave-size: 12px;
    --wave-min-grabber: 36px;
    --wave-fade: 220ms;
    --wave-ease: cubic-bezier(.2, .85, .25, 1);

    display: block;
    position: relative;
    overflow: clip;
    color-scheme: light dark;
    /* Let the grabber (a sibling of .viewport) read the viewport's timeline. */
    timeline-scope: --wave-y;
  }

  .viewport {
    block-size: 100%;
    inline-size: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-width: none;            /* Firefox: hide native bar */
    scroll-timeline: --wave-y block;  /* drive the CSS scroll-driven animation */
  }
  .viewport::-webkit-scrollbar { width: 0; height: 0; } /* Chromium / WebKit */

  .bar {
    position: absolute;
    inset-block: var(--wave-track-inset);
    inset-inline-end: var(--wave-track-inset);
    inline-size: var(--wave-size);
    z-index: 2;
    pointer-events: none;             /* only the grabber catches the pointer */
    opacity: 1;
    transition: opacity var(--wave-fade) ease;
  }
  .bar[hidden] { display: none; }
  :host([auto-hide]) .bar { opacity: 0; }
  :host([auto-hide]:hover) .bar,
  :host([auto-hide][data-active]) .bar { opacity: 1; }

  /* Soft inset track so the bar reads as an overlay, not a gutter. */
  .track {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: color-mix(in srgb, currentColor 8%, transparent);
    opacity: 0;
    transition: opacity var(--wave-fade) ease;
  }
  :host(:hover) .track,
  :host([data-active]) .track { opacity: 1; }

  /* The grabber: glassy, springy, follows scroll via the CSS timeline. */
  .grabber {
    position: absolute;
    inset-inline: 0;
    block-size: clamp(var(--wave-min-grabber), calc(var(--ratio, .3) * 100%), 100%);
    border-radius: 999px;
    pointer-events: auto;
    cursor: grab;
    touch-action: none;
    background: color-mix(in srgb, var(--wave-accent) 78%, transparent);
    box-shadow:
      0 2px 12px color-mix(in srgb, var(--wave-accent) 45%, transparent),
      inset 0 0 0 1px rgba(255, 255, 255, .28);
    transition: inline-size var(--wave-fade) var(--wave-ease),
                filter var(--wave-fade) ease;
    will-change: transform;
    animation: wave-track linear both;
    animation-timeline: --wave-y;
  }
  @supports (backdrop-filter: blur(1px)) {
    .grabber { backdrop-filter: blur(8px) saturate(1.5); }
  }
  .grabber:hover { filter: brightness(1.12); }
  .grabber:active { cursor: grabbing; }
  /* When JS takes temporary control (the delayed dragger), silence the CSS
     timeline so the inline transform wins. */
  .grabber.frozen { animation: none; }

  @keyframes wave-track {
    to { transform: translateY(var(--travel, 0px)); }
  }

  /* The thin indicator marks the *true* target while the grabber lingers. */
  .indicator {
    position: absolute;
    inset-inline: 0;
    margin-inline: auto;
    inline-size: 3px;
    block-size: clamp(var(--wave-min-grabber), calc(var(--ratio, .3) * 100%), 100%);
    border-radius: 999px;
    background: var(--wave-accent);
    opacity: 0;
    transition: opacity var(--wave-fade) ease;
    pointer-events: none;
    animation: wave-track linear both;
    animation-timeline: --wave-y;
  }
  .indicator.show { opacity: .9; }

  /* Section pills: jump targets along the track (opt-in via the sections
     attribute). They sit behind the grabber, which stays on top for dragging. */
  .pills { position: absolute; inset: 0; pointer-events: none; }
  .pill {
    position: absolute;
    inset-inline: 0;
    margin-inline: auto;
    inline-size: 6px;
    block-size: 6px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: color-mix(in srgb, currentColor 45%, transparent);
    cursor: pointer;
    pointer-events: auto;
    opacity: .5;
    translate: 0 -50%;            /* center the dot on its computed offset */
    transition: opacity var(--wave-fade) ease,
                scale var(--wave-fade) var(--wave-ease),
                background var(--wave-fade) ease;
  }
  :host(:hover) .pill,
  :host([data-active]) .pill { opacity: 1; }
  .pill:hover, .pill:focus-visible { scale: 1.6; outline: none; }
  .pill.active {
    background: var(--wave-accent);
    box-shadow: 0 0 8px var(--wave-accent);
    opacity: 1;
    scale: 1.3;
  }
  .pill .tip {
    position: absolute;
    inset-inline-end: calc(100% + 8px);
    inset-block-start: 50%;
    translate: 0 -50%;
    max-inline-size: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: .2rem .5rem;
    border-radius: 6px;
    background: rgba(0, 0, 0, .82);
    color: #fff;
    font: 500 .72rem/1.3 system-ui, sans-serif;
    opacity: 0;
    pointer-events: none;
    transition: opacity .15s ease;
  }
  .pill:hover .tip, .pill:focus-visible .tip { opacity: 1; }

  /* Arrow buttons live inside the grabber, like the original Wave bar. */
  .arrow {
    position: absolute;
    inset-inline: 0;
    block-size: 18px;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: rgba(255, 255, 255, .85);
    cursor: pointer;
    display: grid;
    place-items: center;
    pointer-events: auto;
    opacity: 0;
    transition: opacity var(--wave-fade) ease;
  }
  .arrow svg { inline-size: 9px; block-size: 9px; }
  .arrow.up { inset-block-start: 2px; }
  .arrow.down { inset-block-end: 2px; }
  :host(:hover) .grabber .arrow,
  :host([data-active]) .grabber .arrow { opacity: 1; }
  .arrow:hover { color: #fff; }
  :host([no-arrows]) .arrow { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .grabber, .indicator, .track, .bar, .arrow, .pill, .tip { transition: none; }
  }
`;

const ARROW = (dir) => /* html */ `
  <button class="arrow ${dir}" part="arrow" type="button"
          aria-label="Scroll ${dir === 'up' ? 'up' : 'down'}">
    <svg viewBox="0 0 10 10" aria-hidden="true">
      <path d="${dir === 'up' ? 'M1 7l4-4 4 4' : 'M1 3l4 4 4-4'}"
            fill="none" stroke="currentColor" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>`;

class WaveScroll extends HTMLElement {
  static observedAttributes = ['accent', 'sections'];

  #viewport;
  #bar;
  #grabber;
  #indicator;
  #pills;
  #slot;
  #resizeObserver;
  #frozen = false;
  #goal = 0; // last requested scrollTop (for accumulating arrow steps)
  #sections = []; // [{ el, pill, top }] when the `sections` feature is on

  // Properties that reflect attributes, so frameworks (React/Vue) and plain JS
  // can bind to `el.accent`, `el.autoHide`, `el.noArrows` directly.
  get accent() { return this.getAttribute('accent'); }
  set accent(value) {
    value == null ? this.removeAttribute('accent') : this.setAttribute('accent', value);
  }

  get autoHide() { return this.hasAttribute('auto-hide'); }
  set autoHide(value) { this.toggleAttribute('auto-hide', Boolean(value)); }

  get noArrows() { return this.hasAttribute('no-arrows'); }
  set noArrows(value) { this.toggleAttribute('no-arrows', Boolean(value)); }

  /**
   * Opt in to section pills. `true` uses the default `h2` selector; a string is
   * used as a CSS selector; `false`/`null` turns the feature off. Elements
   * carrying `data-wave-section` are always included on top of the selector.
   */
  get sections() { return this.getAttribute('sections'); }
  set sections(value) {
    if (value === false || value == null) this.removeAttribute('sections');
    else this.setAttribute('sections', value === true ? '' : String(value));
  }

  connectedCallback() {
    if (!this.shadowRoot) this.#render();
    this.#applyAccent();
    this.#wire();
    this.#update();
    this.#collectSections();
  }

  disconnectedCallback() {
    this.#resizeObserver?.disconnect();
    REDUCED_MOTION.removeEventListener?.('change', this.#update);
  }

  attributeChangedCallback(name) {
    if (!this.shadowRoot) return;
    if (name === 'accent') this.#applyAccent();
    else if (name === 'sections') this.#collectSections();
  }

  #render() {
    const root = this.attachShadow({ mode: 'open' });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(STYLES);
    root.adoptedStyleSheets = [sheet];
    root.innerHTML = /* html */ `
      <div class="viewport" part="viewport"><slot></slot></div>
      <div class="bar" part="bar">
        <div class="track" part="track"></div>
        <div class="pills" part="pills"></div>
        <div class="indicator" part="indicator"></div>
        <div class="grabber" part="grabber">
          ${ARROW('up')}
          ${ARROW('down')}
        </div>
      </div>`;

    this.#viewport = root.querySelector('.viewport');
    this.#bar = root.querySelector('.bar');
    this.#grabber = root.querySelector('.grabber');
    this.#indicator = root.querySelector('.indicator');
    this.#pills = root.querySelector('.pills');
    this.#slot = root.querySelector('slot');

    // Fallback path: drive the grabber from JS when CSS timelines are absent.
    if (!NATIVE_TIMELINE) this.#grabber.classList.add('frozen');
  }

  #applyAccent() {
    const accent = this.getAttribute('accent');
    if (accent) this.style.setProperty('--wave-accent', accent);
  }

  #wire() {
    // Keep dimensions fresh: viewport resize + slotted content growth.
    this.#resizeObserver = new ResizeObserver(() => this.#update());
    this.#resizeObserver.observe(this.#viewport);
    this.#slot.addEventListener('slotchange', () => {
      for (const el of this.#slot.assignedElements()) this.#resizeObserver.observe(el);
      this.#update();
      this.#collectSections(); // content changed → rediscover sections
    });

    // Track the "goal" so arrow steps accumulate, and (in fallback mode) move
    // the grabber to match the live scroll position.
    this.#viewport.addEventListener('scroll', this.#onScroll, { passive: true });

    // Drag the grabber to scroll.
    this.#grabber.addEventListener('pointerdown', this.#onGrabberDown);

    // Arrow click = the delayed-dragger step scroll.
    for (const arrow of this.#grabber.querySelectorAll('.arrow')) {
      arrow.addEventListener('pointerdown', (e) => e.stopPropagation());
      arrow.addEventListener('click', () =>
        this.#stepScroll(arrow.classList.contains('up') ? -1 : 1),
      );
    }

    // Releasing the delayed dragger when the pointer leaves the bar.
    this.#bar.addEventListener('pointerleave', () => this.#release());

    REDUCED_MOTION.addEventListener?.('change', this.#update);
  }

  // --- geometry -------------------------------------------------------------

  get #scrollable() {
    return this.#viewport.scrollHeight - this.#viewport.clientHeight;
  }

  get #travel() {
    return Math.max(0, this.#bar.clientHeight - this.#grabber.clientHeight);
  }

  #update = () => {
    const vp = this.#viewport;
    const canScroll = vp.scrollHeight > vp.clientHeight + 1;
    this.#bar.hidden = !canScroll;
    if (!canScroll) return;

    // Grabber height is proportional to how much content is visible.
    this.style.setProperty('--ratio', (vp.clientHeight / vp.scrollHeight).toFixed(4));
    // Reading clientHeight here forces a sync layout, so --travel reflects the
    // ratio we just set. CSS keyframes interpolate translateY(0) → --travel.
    this.style.setProperty('--travel', `${this.#travel}px`);

    if (!NATIVE_TIMELINE && !this.#frozen) this.#paintThumb();
    this.#layoutSections(); // content/size may have shifted section offsets
  };

  // Position grabber + indicator from scrollTop (fallback / drag-follow path).
  #paintThumb() {
    const frac = this.#scrollable > 0 ? this.#viewport.scrollTop / this.#scrollable : 0;
    const y = frac * this.#travel;
    if (!this.#frozen) this.#grabber.style.transform = `translateY(${y}px)`;
    this.#indicator.style.transform = `translateY(${y}px)`;
  }

  #onScroll = () => {
    if (!this.#frozen) this.#goal = this.#viewport.scrollTop;
    if (!NATIVE_TIMELINE) this.#paintThumb();
    this.#updateActiveSection();
  };

  // --- section pills --------------------------------------------------------

  // (Re)build the pill buttons from the slotted content. No-op (and clears any
  // existing pills) unless the `sections` attribute is present.
  #collectSections() {
    if (!this.#pills) return;
    this.#pills.replaceChildren();
    this.#sections = [];
    if (!this.hasAttribute('sections')) return;

    const selector = (this.getAttribute('sections') || '').trim() || 'h2';
    let matches;
    try {
      matches = [...this.querySelectorAll(`${selector}, [data-wave-section]`)];
    } catch {
      // Invalid selector → fall back to explicit markers only.
      matches = [...this.querySelectorAll('[data-wave-section]')];
    }
    // Keep only our own content (not a nested <wave-scroll>'s), and dedupe.
    const els = matches.filter(
      (el, i, arr) => el.closest('wave-scroll') === this && arr.indexOf(el) === i,
    );

    for (const el of els) {
      const label =
        (el.getAttribute('data-wave-section') || el.textContent || '').trim() || 'Section';
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'pill';
      pill.setAttribute('part', 'pill');
      pill.setAttribute('aria-label', `Jump to ${label}`);
      const tip = document.createElement('span');
      tip.className = 'tip';
      tip.textContent = label;
      pill.append(tip);

      const section = { el, pill, top: 0 };
      pill.addEventListener('click', () => this.#jumpToSection(section));
      pill.addEventListener('pointerdown', (e) => e.stopPropagation()); // not a drag

      this.#pills.append(pill);
      this.#sections.push(section);
    }
    this.#layoutSections();
  }

  // Position each pill along the track at its section's scroll location.
  #layoutSections() {
    if (!this.#sections.length) return;
    const vpTop = this.#viewport.getBoundingClientRect().top;
    const scrollTop = this.#viewport.scrollTop;
    for (const s of this.#sections) {
      s.top = s.el.getBoundingClientRect().top - vpTop + scrollTop;
    }
    this.#sections.sort((a, b) => a.top - b.top);

    // A section's precise spot on the track is the grabber's *top edge* when
    // that section is scrolled to the top — which equals its proportional
    // position in the document. (frac * travel, not the grabber's center.)
    const range = this.#scrollable;
    const travel = this.#travel;
    for (const s of this.#sections) {
      const frac = range > 0 ? Math.min(1, Math.max(0, s.top / range)) : 0;
      s.pill.style.insetBlockStart = `${frac * travel}px`;
    }
    this.#updateActiveSection();
  }

  // Highlight the pill for the section currently in view.
  #updateActiveSection() {
    if (!this.#sections.length) return;
    const y = this.#viewport.scrollTop + this.#viewport.clientHeight * 0.25;
    let active = 0;
    for (let i = 0; i < this.#sections.length; i++) {
      if (this.#sections[i].top <= y) active = i;
      else break;
    }
    this.#sections.forEach((s, i) => s.pill.classList.toggle('active', i === active));
  }

  #jumpToSection(section) {
    this.#goal = Math.min(this.#scrollable, Math.max(0, section.top));
    this.#viewport.scrollTo({
      top: this.#goal,
      behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth',
    });
  }

  // --- drag to scroll -------------------------------------------------------

  #onGrabberDown = (e) => {
    e.preventDefault();
    this.#grabber.setPointerCapture(e.pointerId);
    this.setAttribute('data-active', '');
    this.#indicator.classList.add('show');

    const barRect = this.#bar.getBoundingClientRect();
    const grabRect = this.#grabber.getBoundingClientRect();
    const offset = e.clientY - grabRect.top; // pointer position within grabber

    const onMove = (ev) => {
      const top = ev.clientY - barRect.top - offset;
      const frac = this.#travel > 0 ? Math.min(1, Math.max(0, top / this.#travel)) : 0;
      this.#viewport.scrollTop = frac * this.#scrollable; // CSS timeline follows
    };
    const onUp = (ev) => {
      this.#grabber.releasePointerCapture?.(ev.pointerId);
      this.#grabber.removeEventListener('pointermove', onMove);
      this.#grabber.removeEventListener('pointerup', onUp);
      this.removeAttribute('data-active');
      this.#indicator.classList.remove('show');
    };
    this.#grabber.addEventListener('pointermove', onMove);
    this.#grabber.addEventListener('pointerup', onUp);
  };

  // --- arrow step + delayed dragger -----------------------------------------

  #stepScroll(direction) {
    const step = Math.max(120, this.#viewport.clientHeight * 0.4);
    this.#goal = Math.min(this.#scrollable, Math.max(0, this.#goal + direction * step));

    this.#freeze();
    this.#indicator.classList.add('show');
    this.setAttribute('data-active', '');

    this.#viewport.scrollTo({
      top: this.#goal,
      behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth',
    });
  }

  // Hold the grabber in place while the content scrolls underneath it.
  #freeze() {
    if (this.#frozen && NATIVE_TIMELINE) return;
    this.#frozen = true;
    if (NATIVE_TIMELINE) {
      const held = this.#currentY();
      this.#grabber.style.transform = `translateY(${held}px)`;
      this.#grabber.classList.add('frozen');
    }
    // In fallback mode .frozen is already set; #paintThumb skips the grabber.
  }

  // Pointer left the bar: glide the grabber to the real position, then hand
  // control back to the CSS timeline (no snap — target == timeline position).
  #release() {
    this.setAttribute('data-active', '');
    if (!this.#frozen) {
      this.removeAttribute('data-active');
      this.#indicator.classList.remove('show');
      return;
    }

    const from = this.#currentY();
    const to = (this.#scrollable > 0 ? this.#viewport.scrollTop / this.#scrollable : 0) * this.#travel;
    const settle = () => {
      this.#frozen = false;
      this.#indicator.classList.remove('show');
      this.removeAttribute('data-active');
      if (NATIVE_TIMELINE) {
        this.#grabber.style.transform = '';
        this.#grabber.classList.remove('frozen');
      } else {
        this.#paintThumb();
      }
    };

    if (REDUCED_MOTION.matches || from === to) {
      settle();
      return;
    }

    const anim = this.#grabber.animate(
      [{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }],
      { duration: 280, easing: 'cubic-bezier(.2,.85,.25,1)', fill: 'forwards' },
    );
    anim.onfinish = () => {
      anim.cancel();
      settle();
    };
  }

  // Current grabber Y, whether driven by the CSS timeline or by JS.
  #currentY() {
    const m = new DOMMatrixReadOnly(getComputedStyle(this.#grabber).transform);
    return m.m42; // translateY
  }
}

customElements.define('wave-scroll', WaveScroll);

export { WaveScroll };
