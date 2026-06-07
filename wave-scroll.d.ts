/**
 * <wave-scroll> — the Google Wave scrollbar, rebuilt as a Web Component.
 *
 * Importing this module registers the `<wave-scroll>` custom element as a
 * side effect.
 */

/** The `<wave-scroll>` custom element instance. */
export declare class WaveScroll extends HTMLElement {
  /** Theme color for the grabber & indicator (mirrors the `accent` attribute). */
  accent: string | null;
  /** Reveal the bar only on hover / interaction (mirrors the `auto-hide` attribute). */
  autoHide: boolean;
  /** Hide the up/down step buttons (mirrors the `no-arrows` attribute). */
  noArrows: boolean;
}

/** Convenience alias for the element instance type. */
export type WaveScrollElement = WaveScroll;

declare global {
  interface HTMLElementTagNameMap {
    'wave-scroll': WaveScroll;
  }
}
