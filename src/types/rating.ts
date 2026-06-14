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
