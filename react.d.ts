import type {
  CSSProperties,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';
import type { WaveScroll as WaveScrollElement } from './wave-scroll.js';

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
  /** Emit a haptic tick when crossing into a new section. Requires `sections`. */
  haptics?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** React component wrapping the `<wave-scroll>` custom element. */
export declare const WaveScroll: ForwardRefExoticComponent<
  WaveScrollProps & RefAttributes<WaveScrollElement>
>;

export default WaveScroll;
