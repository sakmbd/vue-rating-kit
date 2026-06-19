# Customization

## Custom Icon Slots

Replace the default star (★) with any inline content using the `#filled` and `#empty` named slots.

### Emoji Icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const hearts = ref(3.5)
const emoji = ref(2.5)
</script>

<template>
  <!-- Heart icons -->
  <VRating v-model="hearts" :step="0.5">
    <template #filled>❤️</template>
    <template #empty>🤍</template>
  </VRating>

  <!-- Emoji icons with grayscale empty state -->
  <VRating v-model="emoji" :step="0.5">
    <template #filled>😍</template>
    <template #empty>
      <span style="filter: grayscale(1)">😍</span>
    </template>
  </VRating>
</template>
```

### SVG Icons

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(2.5)
</script>

<template>
  <VRating v-model="rating" :step="0.5">
    <template #filled>
      <svg viewBox="0 0 24 24" width="1em" height="1em" style="display: inline-block; vertical-align: middle">
        <path fill="currentColor" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
      </svg>
    </template>
    <template #empty>
      <svg viewBox="0 0 24 24" width="1em" height="1em" style="display: inline-block; vertical-align: middle">
        <path fill="none" stroke="currentColor" stroke-width="2" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
      </svg>
    </template>
  </VRating>
</template>
```

### Slot Props

Both slots receive a `star` prop containing the 1-based index of the star being rendered (1 … max):

```vue
<VRating v-model="rating">
  <template #filled="{ star }">
    <span :title="`${star} stars`">★</span>
  </template>
  <template #empty="{ star }">
    <span :title="`${star} stars`">☆</span>
  </template>
</VRating>
```

::: warning Slot content must be inline-level
Use emoji, text characters, or `inline`/`inline-block` SVG. Block-level elements break precision clipping, which relies on `overflow: hidden` and a dynamic `width` percentage on the fill container.
:::

---

## Size Variants

### Named Presets

Named presets scale both star size and the gap between stars:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(3)
</script>

<template>
  <VRating v-model="rating" size="sm" />
  <VRating v-model="rating" size="md" />
  <VRating v-model="rating" size="lg" />
</template>
```

| Preset | Star size | Gap |
| --- | --- | --- |
| `sm` | `1.25rem` | `0.125rem` |
| `md` | `2rem` | `0.25rem` |
| `lg` | `3rem` | `0.5rem` |

When `size` is omitted the component renders at `2rem` (same as `md`) without adding a modifier class.

### Numeric Pixel Values

Pass a number to set the star size in pixels:

```vue
<VRating v-model="rating" :size="18" />
<VRating v-model="rating" :size="40" />
```

The gap retains its default (`0.25rem`) and can be overridden via `--vrk-star-gap` if needed.

### CSS Units

For sizes in `rem`, `em`, or fluid values, override `--vrk-star-size` directly:

```css
.my-rating {
  --vrk-star-size: clamp(1.5rem, 3vw, 3rem);
}
```

### Combining Size with Slots

Size and custom icons compose naturally:

```vue
<VRating v-model="rating" size="lg" :step="0.5">
  <template #filled>❤️</template>
  <template #empty>🤍</template>
</VRating>
```

---

## Color Customization

Use the `color`, `emptyColor`, and `hoverColor` props to customize star colors without writing CSS. All props accept any valid CSS color value: named colors, hex, `rgb()`, `hsl()`, or `var(--my-token)` for design token integration.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(3)
const combo = ref(3.5)
</script>

<template>
  <!-- Filled star color only — hover inherits this color automatically -->
  <VRating v-model="rating" color="green" />

  <!-- Empty color only -->
  <VRating v-model="rating" emptyColor="#d1d5db" />

  <!-- Filled and empty colors -->
  <VRating v-model="combo" :step="0.5" color="green" emptyColor="grey" />

  <!-- Explicit hover color -->
  <VRating v-model="rating" color="green" hoverColor="darkgreen" />

  <!-- Combined with size -->
  <VRating v-model="combo" :step="0.5" size="lg" color="tomato" emptyColor="#ddd" />
</template>
```

**Hover color inheritance:** when `hoverColor` is omitted, hover state automatically inherits `color`. When neither is set, the package default hover color (`#f5c842`) applies.

### Color with Custom Icons

Color props work alongside custom slots:

```vue
<!-- Text symbols with color -->
<VRating v-model="rating" :step="0.5" color="crimson">
  <template #filled>♥</template>
  <template #empty>♡</template>
</VRating>

<!-- SVG icons with color -->
<VRating v-model="rating" :step="0.5" color="tomato" emptyColor="#ccc">
  <template #filled>
    <svg viewBox="0 0 24 24" width="1em" height="1em" style="display: inline-block; vertical-align: middle">
      <path fill="currentColor" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
    </svg>
  </template>
  <template #empty>
    <svg viewBox="0 0 24 24" width="1em" height="1em" style="display: inline-block; vertical-align: middle">
      <path fill="none" stroke="currentColor" stroke-width="2" d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
    </svg>
  </template>
</VRating>
```

::: tip Emoji colors
Color props have no visual effect on emoji slot content — emoji colors are intrinsic to the character and are not controlled by CSS `color`.
:::

---

## CSS Custom Properties

Override on `.vrk-rating` or a parent element for theme-level control. CSS variables always take precedence over color props.

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

| Variable | Default | Description |
| --- | --- | --- |
| `--vrk-color-filled` | `#f5a623` | Filled and partial star color |
| `--vrk-color-empty` | `#d3d3d3` | Empty star track color |
| `--vrk-color-hover` | `#f5c842` | Hover highlight color (consumer override) |
| `--vrk-color-disabled` | `#a9a9a9` | Disabled star track color |
| `--vrk-star-size` | `2rem` | Star size |
| `--vrk-star-gap` | `0.25rem` | Space between stars |
| `--vrk-focus-outline` | `2px solid currentColor` | Keyboard focus ring |

::: tip CSS variables vs. props
Setting `--vrk-color-hover` on the component or any ancestor always overrides the `hoverColor` prop. This makes CSS variables the authoritative customization layer and props a convenient in-template shorthand.
:::
