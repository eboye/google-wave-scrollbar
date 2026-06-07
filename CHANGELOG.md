# Changelog

All notable changes to **wave-scroll** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-06-07

### Added
- **Section pills** — opt in with the `sections` attribute (boolean → default
  `h2` selector, or a CSS selector). Clickable jump-to-section dots are placed
  along the track at each section's exact position; hover a pill for its label,
  and the section currently in view highlights as you scroll. Elements marked
  `data-wave-section="Label"` are always included on top of the selector.
- **Section-stepping arrows** — when `sections` is on, the up/down arrows step to
  the previous/next section instead of the fixed pixel step.
- **Scroll-margin support** — section jumps respect `scroll-margin-top` (on the
  section) and `scroll-padding-top` (on the scroller), so targets clear sticky
  headers; pills stay aligned to the grabber's top edge.
- **`haptics` attribute** — emits a [Vibration API](https://developer.mozilla.org/docs/Web/API/Navigator/vibrate)
  tick when scrolling crosses into a new section (where supported). Requires
  `sections`.
- `sections` and `haptics` exposed through the React and Vue wrappers and the
  TypeScript types, plus a `::part(pill)` styling hook.
- Reflecting `sections` / `haptics` properties on the element.

### Fixed
- Guard `customElements.define` against double-registration (e.g. the module
  loaded via a CDN copy alongside a bundled one), which previously threw.
- Attach DOM listeners once and re-arm the `ResizeObserver` on each connect, so
  moving the element in the DOM no longer double-binds listeners or leaks
  observers.
- The delayed dragger now also releases when the scroll settles (`scrollend`
  with a timeout fallback), fixing a grabber that stayed frozen after
  keyboard or programmatic arrow activation.
- Guard `#currentY` against a `transform: none` computed value (which made
  `DOMMatrix` throw).
- Reset `--wave-accent` when the `accent` attribute is removed.
- Clean up an in-progress drag on `pointercancel`; cancel any in-flight
  glide-back animation when the dragger re-freezes.
- Collapse whitespace in section pill labels.

### Changed
- Reveal the bar, arrows, and pills on `:focus-within` for keyboard users.

## [1.0.0] - 2026-06-07

### Added
- Initial release: `<wave-scroll>`, a zero-dependency Web Component reimagining
  of the Google Wave scrollbar.
- Native scrolling in a real overflow container with the native scrollbar hidden
  and a glassy overlay grabber drawn on top.
- CSS-first motion: the resting grabber position rides a `scroll-timeline`
  (`animation-timeline`), so wheel / trackpad / keyboard scrolling costs zero
  JavaScript per frame, with a JS fallback where unsupported.
- The original Wave interactions: drag-to-scrub, arrow step-scroll, and the
  "delayed dragger" (the grabber lingers while a thin indicator shows the
  target, then glides over once the pointer leaves).
- `accent`, `auto-hide`, and `no-arrows` attributes; theming via
  `--wave-accent` and other custom properties; `::part()` hooks.
- Honours `prefers-color-scheme` and `prefers-reduced-motion`.
- React (`wave-scroll/react`) and Vue (`wave-scroll/vue`) wrappers and
  TypeScript type definitions.

[Unreleased]: https://github.com/eboye/google-wave-scrollbar/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/eboye/google-wave-scrollbar/releases/tag/v1.1.0
[1.0.0]: https://www.npmjs.com/package/wave-scroll/v/1.0.0
