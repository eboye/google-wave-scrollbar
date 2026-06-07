/**
 * Vue 3 wrapper for <wave-scroll>.
 *
 *   import { WaveScroll } from 'wave-scroll/vue';
 *
 *   <WaveScroll accent="#7c6cff" auto-hide>
 *     …your content…
 *   </WaveScroll>
 *
 * Implemented as a render-function component, so it ships as plain JS with no
 * SFC compile step. Using this wrapper also means you don't need Vue's
 * `compilerOptions.isCustomElement` config (that's only needed if you write the
 * raw `<wave-scroll>` tag in a template).
 */
import { defineComponent, h } from 'vue';
import './wave-scroll.js';

export const WaveScroll = defineComponent({
  name: 'WaveScroll',
  props: {
    accent: { type: String, default: undefined },
    autoHide: { type: Boolean, default: false },
    noArrows: { type: Boolean, default: false },
    sections: { type: [Boolean, String], default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'wave-scroll',
        {
          ...attrs,
          accent: props.accent,
          // Presence attributes: empty string = present, null = absent.
          'auto-hide': props.autoHide ? '' : null,
          'no-arrows': props.noArrows ? '' : null,
          // `sections`: true → default selector (''), string → custom selector.
          sections: props.sections === true ? '' : props.sections || null,
        },
        slots.default ? slots.default() : undefined,
      );
  },
});

export default WaveScroll;
