# vue-rating-kit

Lightweight, accessible, enterprise-grade star rating component for Vue 3. Built with the Composition API, fully typed with TypeScript, and styled with pure CSS.

* ⭐ Lightweight with zero runtime dependencies
* ♿ Accessible with ARIA support
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

const rating = ref(2)
</script>

<template>
  <VRating
    v-model="rating"
    disabled
  />
</template>
```

---

## Props

| Prop         | Type      | Default    | Description                                                      |
| ------------ | --------- | ---------- | ---------------------------------------------------------------- |
| `modelValue` | `number`  | `0`        | Current rating value (use with `v-model`)                        |
| `max`        | `number`  | `5`        | Total number of stars                                            |
| `readonly`   | `boolean` | `false`    | Prevents value changes while preserving hover and focus behavior |
| `disabled`   | `boolean` | `false`    | Prevents all interaction and applies disabled styling            |
| `ariaLabel`  | `string`  | `'Rating'` | Accessible label for the rating group                            |

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

| Key          | Action                          |
| ------------ | ------------------------------- |
| `ArrowRight` | Increment rating by 1           |
| `ArrowLeft`  | Decrement rating by 1           |
| `Home`       | Set rating to `0`               |
| `End`        | Set rating to the maximum value |

---

## Accessibility

`vue-rating-kit` follows accessible rating patterns and includes:

* `radiogroup` semantics for the rating container
* `radio` semantics for individual stars
* `aria-checked` support
* `aria-disabled` support
* `aria-readonly` support
* Keyboard navigation support
* Focus and blur boundary handling
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
