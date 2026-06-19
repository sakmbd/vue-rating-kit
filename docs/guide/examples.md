# Examples

## Basic Usage

Two-way binding with `v-model`. A value of `0` represents no rating selected.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(3)
</script>

<template>
  <VRating v-model="rating" />
  <p>Value: {{ rating }}</p>
</template>
```

## Precision Ratings

Control the granularity of selectable values using the `step` prop.

| Step | Selectable values |
| --- | --- |
| `1` | `1`, `2`, `3`, `4`, `5` |
| `0.5` | `0.5`, `1.0`, `1.5`, … `5` |
| `0.25` | `0.25`, `0.5`, `0.75`, … `5` |
| `0.2` | `0.2`, `0.4`, `0.6`, … `5` |
| `0.1` | `0.1`, `0.2`, `0.3`, … `5` |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(2.5)
</script>

<template>
  <!-- Half-star precision -->
  <VRating v-model="rating" :step="0.5" />

  <!-- Quarter-star precision -->
  <VRating v-model="rating" :step="0.25" />
</template>
```

Stars render fractionally — a value of `2.5` fills exactly half of the third star. The `step` prop must be a positive divisor of `1`. Unsupported values (e.g. `0.3`) warn in development and fall back to `1`.

## Custom Maximum

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(7.5)
</script>

<template>
  <VRating v-model="rating" :max="10" :step="0.5" />
</template>
```

## RTL Support

Place the component inside an element with `dir="rtl"`. No extra props required — RTL activates automatically when the component or any ancestor carries the attribute.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const basic = ref(3)
const precision = ref(2.5)
const tenStars = ref(7.5)
</script>

<template>
  <!-- RTL basic -->
  <div dir="rtl">
    <VRating v-model="basic" />
  </div>

  <!-- RTL with precision -->
  <div dir="rtl">
    <VRating v-model="precision" :step="0.25" />
  </div>

  <!-- RTL with custom max -->
  <div dir="rtl">
    <VRating v-model="tenStars" :max="10" :step="0.5" />
  </div>
</template>
```

Arrow key navigation reverses in RTL: `ArrowLeft` increments, `ArrowRight` decrements.

## Readonly vs Disabled

Both modes prevent value changes but behave differently:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const readonly = ref(4.5)
const disabled = ref(2.5)
</script>

<template>
  <!-- Readonly: same appearance, no interaction -->
  <VRating v-model="readonly" :step="0.5" readonly />

  <!-- Disabled: reduced opacity, not-allowed cursor, pointer-events blocked -->
  <VRating v-model="disabled" :step="0.5" disabled />
</template>
```

`readonly` is for display contexts where the value should be visible but not editable. `disabled` communicates that the control is unavailable.

## Events

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'

const rating = ref(0)
const hovered = ref(0)
</script>

<template>
  <VRating
    v-model="rating"
    @change="(value) => console.log('committed:', value)"
    @hover="hovered = $event"
    @focus="console.log('focused')"
    @blur="console.log('blurred')"
  />
  <p>Hovering: {{ hovered || '—' }}</p>
</template>
```

**`update:modelValue`** — emitted on every value change (powers `v-model`).

**`change`** — emitted only when the user commits a rating via click or touch. Not emitted during keyboard navigation.

**`hover`** — emitted on every star enter/leave. Value is `0` when the pointer leaves the component.

**`focus` / `blur`** — emitted when keyboard focus enters or leaves the component boundary.
