<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_MAX, DEFAULT_VALUE } from '../constants'
import { useRating } from '../composables/useRating'
import type { RatingProps, RatingEmits } from '../types/rating'
import '../styles/rating.css'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: DEFAULT_VALUE,
  max: DEFAULT_MAX,
  readonly: false,
  disabled: false,
  ariaLabel: 'Rating',
})

const emit = defineEmits<RatingEmits>()

const { hoverValue, handleClick, handleMouseEnter, handleMouseLeave, handleKeydown } =
  useRating(props, emit)

const rootRef = ref<HTMLElement | null>(null)

function handleFocusin(event: FocusEvent): void {
  if (!rootRef.value?.contains(event.relatedTarget as Node)) {
    emit('focus')
  }
}

function handleFocusout(event: FocusEvent): void {
  if (!rootRef.value?.contains(event.relatedTarget as Node)) {
    emit('blur')
  }
}

function getStarClasses(star: number) {
  return {
    'vrk-rating__star': true,
    'vrk-rating__star--filled': star <= (props.modelValue ?? DEFAULT_VALUE),
    'vrk-rating__star--hover': hoverValue.value > 0 && star <= hoverValue.value,
    'vrk-rating__star--readonly': props.readonly,
    'vrk-rating__star--disabled': props.disabled,
  }
}

function getStarTabIndex(star: number): number {
  if (props.disabled) return -1
  const activeValue = props.modelValue ?? DEFAULT_VALUE
  const activeStar = activeValue > 0 ? activeValue : 1
  return star === activeStar ? 0 : -1
}
</script>

<template>
  <div
    ref="rootRef"
    class="vrk-rating"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readonly || undefined"
    @focusin="handleFocusin"
    @focusout="handleFocusout"
  >
    <span
      v-for="star in max"
      :key="star"
      role="radio"
      :aria-checked="star === modelValue"
      :aria-label="`${star} ${star === 1 ? 'star' : 'stars'}`"
      :tabindex="getStarTabIndex(star)"
      :class="getStarClasses(star)"
      @click="handleClick(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeydown"
    >&#9733;</span>
  </div>
</template>
