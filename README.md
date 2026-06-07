<div align="center">

# 〰️ wave-scroll

### The Google Wave scrollbar, rebuilt for 2026.

A **zero-dependency Web Component** that reimagines Google Wave's tiny, unintrusive
scrollbar — native scrolling, a glassy overlay grabber, and motion driven almost
entirely by CSS.

[![Web Component](https://img.shields.io/badge/web-component-7c6cff?style=flat-square)](https://developer.mozilla.org/docs/Web/API/Web_components)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-00d9c0?style=flat-square)](#)
[![ES Module](https://img.shields.io/badge/ESM-native-f4f4ff?style=flat-square&labelColor=14142b)](#)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)

</div>

---

## ✦ Why

Google Wave is long gone, but its scrollbar deserved better than a jQuery plugin.
In its tiny form-factor, the original managed to:

- 📏 **Indicate document height**
- 📍 **Show the current scroll location**
- 🔼 **Scroll by clicking the arrows** — the dragger doesn't move until you move your mouse away
- ✋ **Scroll by dragging**

Fifteen years on, the platform finally has the primitives to express that idea
natively. This is that scrollbar, rebuilt from scratch with **no dependencies** —
no jQuery, no jQuery UI, no sprite PNGs.

> Originally based on the [Konr Ness](http://konrness.com) jQuery plugin.

---

## ✦ Highlights

| | |
|---|---|
| 🪶 **Native by default** | Content scrolls in a real overflow container — keyboard, touch, momentum, and find-in-page all keep working. The native bar is hidden; a custom overlay is painted on top. |
| 🎞️ **CSS-first motion** | The resting grabber position rides a CSS `scroll-timeline`, so wheel / trackpad / keyboard scrolling costs **zero JavaScript per frame**. |
| 〰️ **Faithful behavior** | JS powers only the three Wave signatures: drag-to-scrub, arrow step-scroll, and the *delayed dragger* (the grabber lingers while a thin indicator shows where you're heading, then glides over once the pointer leaves). |
| 🌗 **Considerate** | Honours `prefers-color-scheme` and `prefers-reduced-motion`, encapsulated in Shadow DOM, themeable, and degrades gracefully where scroll-driven animations aren't supported. |

---

## ✦ Install

No build step. Just drop in the module:

```html
<script type="module" src="wave-scroll.js"></script>
```

---

## ✦ Usage

Wrap your content and give the element a sized container:

```html
<wave-scroll accent="#7c6cff">
  <article>
    <!-- …your long content… -->
  </article>
</wave-scroll>
```

```css
wave-scroll {
  display: block;
  block-size: 100%; /* fills its host; give it a height */
}
```

That's the whole API.

---

## ✦ Attributes

| Attribute | Description |
|-----------|-------------|
| `accent` | Theme color for the grabber & indicator. Also settable via the `--wave-accent` CSS custom property. |
| `auto-hide` | Only reveal the bar on hover / interaction. |
| `no-arrows` | Hide the up/down step buttons for a cleaner, minimal bar. |

### Theming

Every visual knob is a CSS custom property you can override:

```css
wave-scroll {
  --wave-accent: #00d9c0;   /* grabber & indicator color */
  --wave-size: 12px;        /* bar width */
  --wave-min-grabber: 36px; /* smallest grabber height */
  --wave-track-inset: 6px;  /* gap from the edges */
  --wave-fade: 220ms;       /* reveal / fade timing */
}
```

You can also style the internals via `::part()`:

```css
wave-scroll::part(grabber) { box-shadow: 0 2px 12px #0008; }
wave-scroll::part(track)   { background: #fff2; }
```

---

## ✦ Demo

Serve the folder over HTTP and open `index.html`:

```sh
python3 -m http.server
# → http://localhost:8000
```

---

## ✦ How it works

```
┌─ <wave-scroll> ─────────────────────────────┐
│  ┌─ .viewport (native overflow:auto) ─────┐ │
│  │   scroll-timeline: --wave-y            │ │  ← real, native scrolling
│  │   <slot> your content </slot>          │ │
│  └────────────────────────────────────────┘ │
│                                       ┌────┐ │
│   overlay bar (Shadow DOM)            │ ▲  │ │  ← grabber rides the
│                                       │ ▓▓ │ │     scroll-timeline in CSS
│                                       │ ▼  │ │
│                                       └────┘ │
└──────────────────────────────────────────────┘
```

The grabber's `translateY` is keyed to a CSS `scroll-timeline`, so the browser
moves it on the compositor as you scroll — no per-frame JavaScript. JS steps in
only for drag, arrow clicks, and the delayed-dragger reveal, then hands control
straight back to the timeline with no visual snap.

---

## License

[MIT](#license).
