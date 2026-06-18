<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { DEFAULT_MAX, DEFAULT_VALUE } from '../constants'
import { clamp } from '../utils/clamp'
import { useRating } from '../composables/useRating'
import type { RatingProps, RatingEmits, RatingSlotProps } from '../types/rating'
import '../styles/rating.css'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: DEFAULT_VALUE,
  max: DEFAULT_MAX,
  readonly: false,
  disabled: false,
  ariaLabel: 'Rating',
})

const emit = defineEmits<RatingEmits>()

defineSlots<{
  filled?(props: RatingSlotProps): any
  empty?(props: RatingSlotProps): any
}>()

const sizeClass = computed(() =>
  typeof props.size === 'string' ? `vrk-rating--${props.size}` : undefined
)

const sizeStyle = computed<Record<string, string> | undefined>(() =>
  typeof props.size === 'number' ? { '--vrk-star-size': `${props.size}px` } : undefined
)

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

// Live region is injected as a DOM sibling of the radiogroup div so that
// the radiogroup contains only role="radio" controls. aria-live on a sibling
// announces precision sub-step changes that don't move keyboard focus.
const liveEl = ref<HTMLSpanElement | null>(null)

onMounted(() => {
  if (typeof document === 'undefined' || !rootRef.value) return
  const el = document.createElement('span')
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', 'polite')
  el.setAttribute('aria-atomic', 'true')
  el.className = 'vrk-sr-only'
  rootRef.value.insertAdjacentElement('afterend', el)
  liveEl.value = el
})

onUnmounted(() => {
  liveEl.value?.remove()
  liveEl.value = null
})

watch(
  () => props.modelValue ?? DEFAULT_VALUE,
  (newVal, oldVal) => {
    if (!liveEl.value) return
    const prevCeil = oldVal > 0 ? Math.ceil(oldVal) : 0
    const newCeil = newVal > 0 ? Math.ceil(newVal) : 0
    if (prevCeil === newCeil) {
      // Sub-step change within the same star — no focus announcement will fire.
      const max = props.max ?? DEFAULT_MAX
      liveEl.value.textContent = newVal > 0 ? `${newVal} of ${max} stars` : ''
    } else {
      // Star changed — radio focus announcement handles it; clear stale text.
      liveEl.value.textContent = ''
    }
  },
)

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
    :class="sizeClass"
    :style="sizeStyle"
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
      :aria-checked="modelValue > 0 && star === Math.ceil(modelValue ?? DEFAULT_VALUE)"
      :aria-label="`${star} ${star === 1 ? 'star' : 'stars'}`"
      :tabindex="getStarTabIndex(star)"
      :class="getStarClasses(star)"
      @click="handleClick($event, star)"
      @mouseenter="handleMouseEnter($event, star)"
      @mousemove="handleMouseMove($event, star)"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeydown"
    >
      <span class="vrk-rating__star-track" aria-hidden="true">
        <slot name="empty" :star="star">&#9733;</slot>
      </span>
      <span
        class="vrk-rating__star-fill"
        :style="{ width: getFillPercent(star) + '%' }"
        aria-hidden="true"
      >
        <slot name="filled" :star="star">&#9733;</slot>
      </span>
    </span>
  </div>
</template>
