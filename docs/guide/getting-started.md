# Getting Started

## Installation

```bash
npm install vue-rating-kit
```

Vue is a peer dependency and must already be present in your project.

## Import

Import the component and its stylesheet. The stylesheet only needs to be imported once, typically in your application entry file.

```ts
import 'vue-rating-kit/style.css'
```

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

## Readonly

Renders the current value without allowing any user interaction.

```vue
<VRating v-model="rating" readonly />
```

## Disabled

Applies disabled styling and suppresses all interaction.

```vue
<VRating v-model="rating" disabled />
```

## Custom Maximum

Default is 5 stars. Pass `:max` for a different scale.

```vue
<VRating v-model="rating" :max="10" />
```
