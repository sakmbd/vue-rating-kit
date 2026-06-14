<script setup lang="ts">
// TODO: Import types — RatingProps, RatingEmits — from '../types/rating'
// TODO: Import composable — useRating — from '../composables/useRating'
// TODO: Import styles — '../styles/rating.css'

// TODO: Define props
//   modelValue : RatingValue  — current rating value (v-model)
//   max        : number       — total number of stars (default: DEFAULT_MAX from constants)
//   readonly   : boolean      — disables interaction, preserves display
//   disabled   : boolean      — disables interaction and applies disabled styling

// TODO: Define emits
//   update:modelValue (value: RatingValue) — emitted when user selects a rating

// TODO: Call useRating composable and destructure reactive state:
//   hoverValue, handleClick, handleMouseEnter, handleMouseLeave, handleKeydown
</script>

<template>
  <!-- TODO: Render rating container with role="radiogroup" and aria-label -->
  <!-- TODO: Render one star element per item in range [1..max] -->
  <!--       Each star should apply vrk-rating__star--filled / --hover / --readonly / --disabled -->
  <!--       Each star must be keyboard-focusable with role="radio" and aria-checked -->
  <!-- TODO: Bind handleClick, handleMouseEnter, handleMouseLeave, handleKeydown -->
</template>
