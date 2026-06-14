# vue-rating-kit

Lightweight, accessible, enterprise-grade star rating component for Vue 3. Built with the Composition API, fully typed with TypeScript, and styled with pure CSS. Zero runtime dependencies.

---

## Installation

```bash
npm install vue-rating-kit
```

Import the stylesheet once in your application entry:

```ts
import 'vue-rating-kit/dist/vue-rating-kit.css'
```

---

## Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(3)
</script>

<template>
  <VRating v-model="rating" />
</template>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `0` | Current rating value (use with `v-model`) |
| `max` | `number` | `5` | Total number of stars |
| `readonly` | `boolean` | `false` | Prevents value changes; hover and focus remain functional |
| `disabled` | `boolean` | `false` | Prevents all interaction and applies disabled styling |
| `ariaLabel` | `string` | `'Rating'` | Accessible label for the rating group |

---

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when a star is clicked (use with `v-model`) |
| `change` | `number` | Emitted when the rating value is committed by user interaction |
| `hover` | `number` | Emitted on star mouseenter (`0` on mouseleave) |
| `focus` | — | Emitted when keyboard focus enters the component |
| `blur` | — | Emitted when keyboard focus leaves the component |

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Increment rating by 1 |
| `ArrowLeft` | Decrement rating by 1 |
| `Home` | Set rating to 0 |
| `End` | Set rating to maximum |

---

## TypeScript

All types are exported for use in TypeScript projects:

```ts
import type { VRating, RatingValue, RatingProps, RatingEmits } from 'vue-rating-kit'
```

Example with typed ref:

```ts
import { ref } from 'vue'
import type { RatingValue } from 'vue-rating-kit'

const rating = ref<RatingValue>(0)
```

---

## CSS Customization

Override CSS custom properties on the `.vrk-rating` element or a parent:

```css
.vrk-rating {
  --vrk-color-filled:   #f5a623; /* filled star color */
  --vrk-color-empty:    #d3d3d3; /* unfilled star color */
  --vrk-color-hover:    #f5c842; /* hover highlight color */
  --vrk-color-disabled: #a9a9a9; /* disabled star color */
  --vrk-star-size:      2rem;    /* star font size */
  --vrk-star-gap:       0.25rem; /* gap between stars */
  --vrk-focus-outline:  2px solid currentColor; /* keyboard focus ring */
}
```

---

## License

MIT
