/**
 * Represents a valid star rating value.
 *
 * Constrained at runtime to the inclusive range [0, max].
 * A value of 0 represents an unset or cleared rating.
 *
 * Defined as a type alias rather than a branded type so consumers
 * can pass plain numbers without casts, while still benefiting from
 * clear naming in IDE tooltips and future refinement without breaking changes.
 */
export type RatingValue = number;

export interface RatingProps {
  /**
   * The current rating value. Supports `v-model`.
   *
   * A value of `0` represents no rating selected.
   * Runtime-validated and clamped to the range `[0, max]`.
   *
   * @default 0
   */
  modelValue?: RatingValue;

  /**
   * Total number of star items to render.
   *
   * Must be a positive integer. Values outside a safe range
   * are clamped at runtime.
   *
   * @default 5
   */
  max?: number;

  /**
   * When `true`, renders the current rating without allowing
   * any user interaction.
   *
   * Readonly stars are fully visible and styleable but do not
   * respond to clicks, hover, or keyboard input.
   *
   * @default false
   */
  readonly?: boolean;

  /**
   * When `true`, fully disables the component.
   *
   * Applies `vrk-rating__star--disabled` styling (reduced opacity,
   * `cursor: not-allowed`) and suppresses all user interactions.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Accessible label for the rating group.
   *
   * Applied as `aria-label` on the root `role="radiogroup"` element.
   * Override with a contextual description for screen reader users,
   * for example: `"Product quality rating"`.
   *
   * @default 'Rating'
   */
  ariaLabel?: string;

  /**
   * Granularity of selectable rating values.
   *
   * Must be a positive divisor of 1 — that is, `1 / step` must be
   * a whole number. This restriction keeps zone arithmetic exact and
   * avoids accumulated floating-point error across the rating scale.
   *
   * Supported values (Phase 2):
   * - `1`    → whole stars only: 0, 1, 2, 3, 4, 5          (default)
   * - `0.5`  → half-star precision: 0, 0.5, 1.0, 1.5, …, 5
   * - `0.25` → quarter-star precision: 0, 0.25, 0.5, …, 5
   * - `0.2`  → fifth-star precision: 0, 0.2, 0.4, …, 5
   * - `0.1`  → tenth-star precision: 0, 0.1, 0.2, …, 5
   *
   * Unsupported (will warn and fall back to `1`):
   * - `0.3`, `0.7`, `0.33`, or any value where `1 / step` is not
   *   a whole number.
   *
   * Arbitrary floating-point precision is not supported in this phase.
   *
   * @default 1
   */
  step?: number;

  /**
   * Size of each star.
   *
   * Pass a named preset (`'sm'` | `'md'` | `'lg'`) or a raw `number` (pixels).
   * When omitted the component renders at the base size (`2rem`) without adding
   * any modifier class — existing consumers are unaffected.
   *
   * Named presets also scale `--vrk-star-gap` proportionally. Numeric values
   * set `--vrk-star-size` only; override `--vrk-star-gap` via CSS if needed.
   *
   * @example
   * // named preset
   * <VRating size="lg" />
   *
   * // exact pixel size
   * <VRating :size="40" />
   */
  size?: RatingSize | number;
}

/**
 * Named size preset for VRating.
 *
 * Use a named preset for common sizes or pass a raw `number` (pixels) for
 * precise control. Consumers needing CSS units other than px (rem, em, clamp)
 * should override the `--vrk-star-size` CSS custom property directly.
 *
 * - `'sm'` → 1.25rem stars
 * - `'md'` → 2rem stars (same as the unsized default)
 * - `'lg'` → 3rem stars
 */
export type RatingSize = 'sm' | 'md' | 'lg'

/**
 * Scoped slot props passed to each `#filled` and `#empty` slot invocation.
 *
 * `star` is the 1-based index of the star being rendered (1 … max).
 * Batch 1 consumers may ignore it; it is exposed now so future batches
 * can implement per-star icon overrides without an API break.
 */
export type RatingSlotProps = {
  star: number
}

/**
 * Slot definitions for VRating.
 *
 * Both slots are optional. When omitted the default Unicode star (★) is rendered.
 *
 * Slot content must be **inline-level** (emoji, text, or inline/inline-block SVG).
 * Block-level elements break precision clipping because the fill container clips
 * its child via `overflow: hidden` + a dynamic `width` percentage.
 */
export type RatingSlots = {
  filled?: (props: RatingSlotProps) => any
  empty?: (props: RatingSlotProps) => any
}

export type RatingEmits = {
  /**
   * Emitted when the user selects a star via click or keyboard
   * activation (Enter / Space). Required for `v-model` support.
   *
   * @param value - The newly selected rating value.
   */
  'update:modelValue': [value: RatingValue];

  /**
   * Emitted when the rating value is committed by user interaction.
   *
   * @param value - The committed rating value.
   */
  change: [value: RatingValue];

  /**
   * Emitted when the pointer enters or leaves a star element.
   *
   * A value of `0` signals the pointer has left the component
   * entirely (no star is being hovered). Consumers use this to
   * render hover-state labels or live preview text.
   *
   * @param value - The hovered star index, or `0` when not hovering.
   */
  hover: [value: RatingValue];

  /**
   * Emitted when keyboard focus enters the rating component.
   *
   * No payload. Consumers use this to trigger focus-related UI
   * such as showing a tooltip or highlight state.
   */
  focus: [];

  /**
   * Emitted when keyboard focus leaves the rating component entirely.
   *
   * No payload. Consumers only need to know that focus has departed —
   * not which star last held it.
   */
  blur: [];
};
