import type { DefineComponent } from 'vue';

export interface WaveScrollProps {
  /** Theme color for the grabber & indicator. */
  accent?: string;
  /** Reveal the bar only on hover / interaction. */
  autoHide?: boolean;
  /** Hide the up/down step buttons. */
  noArrows?: boolean;
}

/** Vue 3 component wrapping the `<wave-scroll>` custom element. */
export declare const WaveScroll: DefineComponent<WaveScrollProps>;

export default WaveScroll;
