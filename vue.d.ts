import type { DefineComponent } from 'vue';

export interface WaveScrollProps {
  /** Theme color for the grabber & indicator. */
  accent?: string;
  /** Reveal the bar only on hover / interaction. */
  autoHide?: boolean;
  /** Hide the up/down step buttons. */
  noArrows?: boolean;
  /**
   * Section pills. `true` uses the default `h2` selector; a string is used as a
   * CSS selector. Elements with `data-wave-section` are always included.
   */
  sections?: boolean | string;
}

/** Vue 3 component wrapping the `<wave-scroll>` custom element. */
export declare const WaveScroll: DefineComponent<WaveScrollProps>;

export default WaveScroll;
