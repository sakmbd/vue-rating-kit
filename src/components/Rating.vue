<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_MAX, DEFAULT_VALUE } from '../constants'
import { clamp } from '../utils/clamp'
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

const rootRef = ref<HTMLElement | null>(null)

const {
  hoverValue,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  handleKeydown,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleTouchCancel,
} = useRating(props, emit)

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

function getFillPercent(star: number): number {
  const activeValue = hoverValue.value > 0 ? hoverValue.value : (props.modelValue ?? DEFAULT_VALUE)
  return clamp(activeValue - (star - 1), 0, 1) * 100
}

function getStarClasses(star: number) {
  const modelVal = props.modelValue ?? DEFAULT_VALUE
  const isHovering = hoverValue.value > 0
  const inHoverRange = isHovering && star <= Math.ceil(hoverValue.value)
  const isPartial = !isHovering && modelVal > (star - 1) && modelVal < star
  return {
    'vrk-rating__star': true,
    'vrk-rating__star--filled': !inHoverRange && star <= modelVal,
    'vrk-rating__star--partial': isPartial,
    'vrk-rating__star--hover': inHoverRange,
    'vrk-rating__star--readonly': props.readonly,
    'vrk-rating__star--disabled': props.disabled,
  }
}

function getStarTabIndex(star: number): number {
  if (props.disabled) return -1
  const activeValue = props.modelValue ?? DEFAULT_VALUE
  const activeStar = activeValue > 0 ? Math.ceil(activeValue) : 1
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
    @touchstart.prevent="handleTouchStart($event, rootRef)"
    @touchmove="handleTouchMove($event, rootRef)"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchCancel"
  >
    <span
      v-for="star in max"
      :key="star"
      role="radio"
      :aria-checked="star === modelValue"
      :aria-label="`${star} ${star === 1 ? 'star' : 'stars'}`"
      :tabindex="getStarTabIndex(star)"
      :class="getStarClasses(star)"
      @click="handleClick($event, star)"
      @mouseenter="handleMouseEnter($event, star)"
      @mousemove="handleMouseMove($event, star)"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeydown"
    >
      <span class="vrk-rating__star-track" aria-hidden="true">&#9733;</span>
      <span
        class="vrk-rating__star-fill"
        :style="{ width: getFillPercent(star) + '%' }"
        aria-hidden="true"
      >&#9733;</span>
    </span>
  </div>
</template>
