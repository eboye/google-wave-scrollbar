/**
 * React wrapper for <wave-scroll>.
 *
 *   import { WaveScroll } from 'wave-scroll/react';
 *
 *   <WaveScroll accent="#7c6cff" autoHide>
 *     …your content…
 *   </WaveScroll>
 *
 * The wrapper forwards a ref to the underlying element and maps camelCase props
 * to the element's attributes. No JSX/build step is required to ship it.
 */
import { createElement, forwardRef } from 'react';
import './wave-scroll.js';

export const WaveScroll = forwardRef(function WaveScroll(props, ref) {
  const { accent, autoHide, noArrows, sections, children, ...rest } = props;
  return createElement(
    'wave-scroll',
    {
      ref,
      accent,
      // Presence attributes: empty string = present, undefined = absent.
      'auto-hide': autoHide ? '' : undefined,
      'no-arrows': noArrows ? '' : undefined,
      // `sections`: true → default selector (''), string → custom selector.
      sections: sections === true ? '' : sections || undefined,
      ...rest,
    },
    children,
  );
});

WaveScroll.displayName = 'WaveScroll';

export default WaveScroll;
