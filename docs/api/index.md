# API Reference

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current rating value. Use with `v-model`. A value of `0` represents no rating selected. |
| `max` | `number` | `5` | Total number of stars to render. |
| `step` | `number` | `1` | Granularity of selectable values. Supported: `1`, `0.5`, `0.25`, `0.2`, `0.1`. Invalid values warn in development and fall back to `1`. |
| `readonly` | `boolean` | `false` | Renders the current value without allowing interaction. |
| `disabled` | `boolean` | `false` | Applies disabled styling and suppresses all interaction. |
| `ariaLabel` | `string` | `'Rating'` | Accessible label applied to the root `role="radiogroup"` element. |
| `size` | `'sm' \| 'md' \| 'lg' \| number` | — | Star size. Named presets scale size and gap together. A number sets the star size in pixels only. |
| `color` | `string` | — | Filled and partial star color. Accepts any CSS color value. Sets `--vrk-color-filled` as an inline style. |
| `emptyColor` | `string` | — | Empty star track color. Accepts any CSS color value. Sets `--vrk-color-empty` as an inline style. |
| `hoverColor` | `string` | — | Hover state color. Inherits from `color` when omitted. Consumer CSS overriding `--vrk-color-hover` always takes precedence. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | Emitted on every value change. Powers `v-model`. |
| `change` | `number` | Emitted when the user commits a rating via click or touch. Not emitted during keyboard navigation. |
| `hover` | `number` | Emitted on every star enter/leave. Value is `0` when the pointer leaves the component. |
| `focus` | — | Emitted when keyboard focus enters the component. |
| `blur` | — | Emitted when keyboard focus leaves the component. |

## Slots

| Slot | Slot Props | Description |
| --- | --- | --- |
| `filled` | `{ star: number }` | Content rendered in the filled layer of each star. `star` is the 1-based index (1 … max). |
| `empty` | `{ star: number }` | Content rendered in the empty (track) layer of each star. `star` is the 1-based index (1 … max). |

Both slots default to the Unicode star character (★) when omitted. Slot content must be inline-level — see [Custom Icon Slots](/guide/customization#custom-icon-slots).

## Keyboard Navigation

| Key | Action |
| --- | --- |
| `ArrowRight` | Increment by `step` (LTR) / Decrement by `step` (RTL) |
| `ArrowLeft` | Decrement by `step` (LTR) / Increment by `step` (RTL) |
| `Home` | Set rating to `0` |
| `End` | Set rating to `max` |

## TypeScript

All public types are exported from the package root:

```ts
import type {
  RatingValue,
  RatingProps,
  RatingEmits,
  RatingSlotProps,
  RatingSlots,
  RatingSize,
} from 'vue-rating-kit'
```

**Typed ref:**

```ts
import { ref } from 'vue'
import type { RatingValue } from 'vue-rating-kit'

const rating = ref<RatingValue>(0)
```

**Typed slot content:**

```ts
import type { RatingSlotProps } from 'vue-rating-kit'

function renderIcon(props: RatingSlotProps) {
  return props.star <= activeRating ? '❤️' : '🤍'
}
```

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--vrk-color-filled` | `#f5a623` | Filled and partial star color |
| `--vrk-color-empty` | `#d3d3d3` | Empty star track color |
| `--vrk-color-hover` | `#f5c842` | Hover highlight color (consumer-level override) |
| `--vrk-color-disabled` | `#a9a9a9` | Disabled star track color |
| `--vrk-star-size` | `2rem` | Star size |
| `--vrk-star-gap` | `0.25rem` | Space between stars |
| `--vrk-focus-outline` | `2px solid currentColor` | Keyboard focus ring |

CSS custom properties always take precedence over component props. See [CSS Custom Properties](/guide/customization#css-custom-properties) for usage.
