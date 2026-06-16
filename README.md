# vue-rating-kit

[![npm version](https://img.shields.io/npm/v/vue-rating-kit)](https://www.npmjs.com/package/vue-rating-kit)
[![npm downloads](https://img.shields.io/npm/dm/vue-rating-kit)](https://www.npmjs.com/package/vue-rating-kit)
[![license](https://img.shields.io/npm/l/vue-rating-kit)](LICENSE)

Lightweight, accessible, enterprise-grade star rating component for Vue 3. Built with the Composition API, fully typed with TypeScript, and styled with pure CSS.

* ⭐ Lightweight with zero runtime dependencies
* ✨ Precision ratings with configurable step values
* 🎨 Fractional visual rendering (half, quarter, and tenth stars)
* 🌍 Native RTL support through the `dir` attribute
* 📱 Touch-friendly interactions with drag support
* ♿ Accessible with ARIA support and screen reader improvements
* ⌨️ Keyboard navigation support
* 🎨 Pure CSS with customizable variables
* 🔒 Readonly and disabled modes
* 📦 TypeScript support with exported types
* 🧪 Comprehensive test coverage
* 🚀 Built for Vue 3 Composition API

---

## Installation

```bash
npm install vue-rating-kit
```

> **Note:** Vue is a peer dependency and must already exist in your project.

Import the stylesheet once in your application entry:

```ts
import 'vue-rating-kit/style.css'
```

---

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'
import 'vue-rating-kit/style.css'

const rating = ref(3)
</script>

<template>
  <VRating v-model="rating" />
</template>
```

---

## Precision Ratings

Control the granularity of selectable rating values using the `step` prop.

Supported values:

| Step   | Example Values                       |
| ------ | ------------------------------------ |
| `1`    | `1`, `2`, `3`, `4`, `5`              |
| `0.5`  | `0.5`, `1.5`, `2.5`, `3.5`, `4.5`    |
| `0.25` | `0.25`, `0.5`, `0.75`, `1.25`, `1.5` |
| `0.2`  | `0.2`, `0.4`, `0.6`, `0.8`, `1.2`    |
| `0.1`  | `0.1`, `0.2`, `0.3`, `0.4`, `0.5`    |

Example:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'
import 'vue-rating-kit/style.css'

const rating = ref(2.5)
</script>

<template>
  <VRating
    v-model="rating"
    :step="0.5"
  />
</template>
```

---

## RTL Support

`vue-rating-kit` automatically respects the native HTML `dir` attribute. No additional props are required.

```vue
<div dir="rtl">
  <VRating
    v-model="rating"
    :step="0.5"
  />
</div>
```

> **Note:** LTR remains the default behavior. RTL activates automatically when the component or one of its ancestors has `dir="rtl"`.

---

## Touch Support

Touch interactions work automatically on touch-enabled devices.

Supported interactions include:

* Tap to select a rating
* Drag across stars to preview ratings
* Fractional precision during drag interactions
* RTL-aware touch behavior

No additional configuration is required.

```vue
<VRating
  v-model="rating"
  :step="0.5"
/>
```

---

## Readonly Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'
import 'vue-rating-kit/style.css'

const rating = ref(4)
</script>

<template>
  <VRating
    v-model="rating"
    readonly
  />
</template>
```

---

## Disabled Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'
import 'vue-rating-kit/style.css'

const rating = ref(2.5)
</script>

<template>
  <VRating
    v-model="rating"
    :step="0.5"
    disabled
  />
</template>
```

> **Note:** Disabled ratings preserve the current rating value while preventing all user interaction.

---

## Custom Maximum Stars

Increase or decrease the number of available stars using the `max` prop.

```vue
<VRating
  v-model="rating"
  :max="10"
  :step="0.5"
/>
```

---

## Props

| Prop         | Type      | Default    | Description                                                                                                   |
| ------------ | --------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `modelValue` | `number`  | `0`        | Current rating value (use with `v-model`)                                                                     |
| `max`        | `number`  | `5`        | Total number of stars                                                                                         |
| `step`       | `number`  | `1`        | Granularity of rating values. Supports `1`, `0.5`, `0.25`, `0.2`, and `0.1`. Invalid values fall back to `1`. |
| `readonly`   | `boolean` | `false`    | Prevents value changes while preserving the current rating display                                            |
| `disabled`   | `boolean` | `false`    | Prevents all interaction while preserving the current rating display using disabled styling                   |
| `ariaLabel`  | `string`  | `'Rating'` | Accessible label for the rating group                                                                         |

---

## Events

| Event               | Payload  | Description                                                    |
| ------------------- | -------- | -------------------------------------------------------------- |
| `update:modelValue` | `number` | Emitted when the rating value changes                          |
| `change`            | `number` | Emitted when the rating value is committed by user interaction |
| `hover`             | `number` | Emitted when hovering over stars (`0` on mouse leave)          |
| `focus`             | —        | Emitted when keyboard focus enters the component               |
| `blur`              | —        | Emitted when keyboard focus leaves the component               |

---

## Keyboard Navigation

| Key          | Action                                                |
| ------------ | ----------------------------------------------------- |
| `ArrowRight` | Increment rating by the configured `step` value (LTR) |
| `ArrowLeft`  | Decrement rating by the configured `step` value (LTR) |
| `Home`       | Set rating to `0`                                     |
| `End`        | Set rating to the maximum value                       |

> **Note:** In RTL contexts, `ArrowLeft` increments the rating and `ArrowRight` decrements it.

---

## Invalid Step Values

The `step` prop must be a positive divisor of `1`.

Unsupported values such as:

```ts
0.3
0.7
0.33
```

will trigger a development warning and automatically fall back to `1`.

---

## Accessibility

`vue-rating-kit` follows accessible rating patterns and includes:

* `radiogroup` semantics for the rating container
* `radio` semantics for individual stars
* Accurate `aria-checked` support for both integer and fractional ratings
* `aria-disabled` support
* `aria-readonly` support
* Keyboard navigation support
* Focus and blur boundary handling
* Screen reader improvements for precision ratings
* Customizable accessible labels through the `ariaLabel` prop

---

## TypeScript

All public types are exported for use in TypeScript projects.

```ts
import type {
  RatingValue,
  RatingProps,
  RatingEmits,
} from 'vue-rating-kit'
```

Example with a typed ref:

```ts
import { ref } from 'vue'
import type { RatingValue } from 'vue-rating-kit'

const rating = ref<RatingValue>(0)
```

---

## CSS Customization

Override CSS custom properties on the `.vrk-rating` element or a parent element.

```css
.vrk-rating {
  --vrk-color-filled: #f5a623;
  --vrk-color-empty: #d3d3d3;
  --vrk-color-hover: #f5c842;
  --vrk-color-disabled: #a9a9a9;

  --vrk-star-size: 2rem;
  --vrk-star-gap: 0.25rem;

  --vrk-focus-outline: 2px solid currentColor;
}
```

| Variable               | Description            |
| ---------------------- | ---------------------- |
| `--vrk-color-filled`   | Filled star color      |
| `--vrk-color-empty`    | Empty star color       |
| `--vrk-color-hover`    | Hover highlight color  |
| `--vrk-color-disabled` | Disabled star color    |
| `--vrk-star-size`      | Star size              |
| `--vrk-star-gap`       | Space between stars    |
| `--vrk-focus-outline`  | Keyboard focus outline |

---

## Development

```bash
npm install
npm run test:run
npm run build
```

---

## License

MIT
