wave-scroll
===========

A modern reimagining of the Google Wave scrollbar (2010 -> 2026).

Google Wave introduced a tiny, unintrusive scrollbar that, in its small
form-factor, managed to indicate document height, show the current scroll
location, scroll by clicking the arrows (the dragger doesn't move until you move
your mouse away), and scroll by dragging. Wave is long gone, but the scrollbar
deserved better than a jQuery plugin -- so this rebuilds it as a zero-dependency
Web Component.

Originally based on the Konr Ness jQuery plugin; rebuilt from scratch in 2026
with no dependencies.


What you get
------------

<wave-scroll> -- a single ES-module custom element.

- Native scrolling underneath. Content lives in a real overflow container, so
  keyboard, touch, momentum, and find-in-page all keep working. The native bar
  is hidden and a glass overlay is painted on top.
- CSS-first motion. The resting grabber position rides a CSS scroll-driven
  animation (scroll-timeline / animation-timeline), so wheel/trackpad/keyboard
  scrolling costs zero JavaScript per frame. JS only powers the three original
  Wave signatures: drag-to-scrub, arrow step-scroll, and the "delayed dragger"
  (the grabber lingers while a thin indicator shows where you're heading, then
  glides over once the pointer leaves).
- Considerate. Honours prefers-color-scheme and prefers-reduced-motion,
  themeable via --wave-accent, Shadow DOM encapsulated, and degrades gracefully
  where scroll-driven animations aren't supported.


Usage
-----

  <script type="module" src="wave-scroll.js"></script>

  <wave-scroll accent="#7c6cff">
    ... your content ...
  </wave-scroll>

The element fills its host; give it a sized container.

Attributes:
  accent      theme color (also settable via the --wave-accent CSS property)
  auto-hide   only reveal the bar on hover / interaction
  no-arrows   hide the up/down step buttons for a minimal bar


Demo
----

Open index.html (served over http, e.g. `python3 -m http.server`) for a live
demo and documentation.


License
-------

MIT.
