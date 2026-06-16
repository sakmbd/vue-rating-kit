import { ref } from 'vue'
import type { Ref, EmitFn } from 'vue'
import { clamp } from '../utils/clamp'
import { DEFAULT_MAX, DEFAULT_STEP, DEFAULT_VALUE, NAVIGATION_KEYS } from '../constants'
import type { RatingProps, RatingEmits } from '../types/rating'

function resolveStep(rawStep: number | undefined, max: number): number {
  const step = rawStep ?? DEFAULT_STEP
  if (step <= 0) {
    if (import.meta.env.DEV) {
      console.warn('[vue-rating-kit] "step" must be a positive number. Falling back to 1.')
    }
    return DEFAULT_STEP
  }
  const reciprocal = 1 / step
  if (Math.abs(Math.round(reciprocal) - reciprocal) >= 1e-9) {
    if (import.meta.env.DEV) {
      console.warn(
        `[vue-rating-kit] "step" must be a divisor of 1 (e.g. 1, 0.5, 0.25, 0.2, 0.1). ` +
          `"${step}" is not supported in Phase 2. Falling back to 1.`,
      )
    }
    return DEFAULT_STEP
  }
  if (import.meta.env.DEV && step > max) {
    console.warn(`[vue-rating-kit] "step" (${step}) exceeds "max" (${max}).`)
  }
  return step
}

function isRTLEvent(event: Event): boolean {
  if (typeof window === 'undefined') return false
  const el = event.currentTarget as HTMLElement | null
  if (!el) return false
  return getComputedStyle(el).direction === 'rtl'
}

function computeValueFromPosition(
  starEl: HTMLElement,
  clientX: number,
  starIndex: number,
  step: number,
  rtl: boolean,
): number {
  const rect = starEl.getBoundingClientRect()
  if (rect.width <= 0) return starIndex
  const rawFraction = rtl
    ? (rect.right - clientX) / rect.width
    : (clientX - rect.left) / rect.width
  const fraction = clamp(rawFraction, 0, 1)
  const zonesPerStar = 1 / step
  const zone = Math.max(1, Math.ceil(fraction * zonesPerStar))
  return (starIndex - 1) + zone * step
}

function computeStarValue(event: MouseEvent, starIndex: number, step: number, rtl: boolean): number {
  return computeValueFromPosition(event.currentTarget as HTMLElement, event.clientX, starIndex, step, rtl)
}

function findTouchStar(
  touch: Touch,
  rootEl: HTMLElement | null,
): { index: number; el: HTMLElement } | null {
  if (!rootEl || typeof document === 'undefined') return null
  const el = document.elementFromPoint(touch.clientX, touch.clientY)
  if (!el) return null
  const starEl = (el as HTMLElement).closest('.vrk-rating__star') as HTMLElement | null
  if (!starEl || !rootEl.contains(starEl)) return null
  const stars = Array.from(rootEl.querySelectorAll('.vrk-rating__star'))
  const idx = stars.indexOf(starEl) + 1
  return idx > 0 ? { index: idx, el: starEl } : null
}

export function useRating(props: RatingProps, emit: EmitFn<RatingEmits>) {
  const hoverValue: Ref<number> = ref(0)

  function isInteractive(): boolean {
    return !props.readonly && !props.disabled
  }

  function updateHoverFromTouch(touch: Touch, rootEl: HTMLElement | null, rtl: boolean): void {
    const found = findTouchStar(touch, rootEl)
    if (!found) return
    const max = props.max ?? DEFAULT_MAX
    const step = resolveStep(props.step, max)
    const value = computeValueFromPosition(found.el, touch.clientX, found.index, step, rtl)
    if (value === hoverValue.value) return
    hoverValue.value = value
    emit('hover', value)
  }

  function handleMouseMove(event: MouseEvent, starIndex: number): void {
    if (!isInteractive()) return
    const max = props.max ?? DEFAULT_MAX
    const step = resolveStep(props.step, max)
    const value = computeStarValue(event, starIndex, step, isRTLEvent(event))
    if (value === hoverValue.value) return
    hoverValue.value = value
    emit('hover', value)
  }

  function handleClick(event: MouseEvent, star: number): void {
    if (!isInteractive()) return
    const max = props.max ?? DEFAULT_MAX
    const step = resolveStep(props.step, max)
    const value = computeStarValue(event, star, step, isRTLEvent(event))
    emit('update:modelValue', value)
    emit('change', value)
  }

  function handleMouseEnter(event: MouseEvent, star: number): void {
    handleMouseMove(event, star)
  }

  function handleMouseLeave(): void {
    if (!isInteractive()) return
    hoverValue.value = 0
    emit('hover', 0)
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (!isInteractive()) return
    if (!(NAVIGATION_KEYS as readonly string[]).includes(event.key)) return

    event.preventDefault()

    const current = props.modelValue ?? DEFAULT_VALUE
    const max = props.max ?? DEFAULT_MAX
    const step = resolveStep(props.step, max)
    const rtl = isRTLEvent(event)

    let next: number

    switch (event.key) {
      case 'ArrowRight':
        next = clamp(current + (rtl ? -step : step), 0, max)
        break
      case 'ArrowLeft':
        next = clamp(current + (rtl ? step : -step), 0, max)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = max
        break
      default:
        return
    }

    emit('update:modelValue', next)
    // 'change' is intentionally not emitted here.
    // The relationship between keyboard navigation and the change event
    // has not been formally defined in the public API contract.
  }

  function handleTouchStart(event: TouchEvent, rootEl: HTMLElement | null): void {
    if (!isInteractive()) return
    const touch = event.touches[0]
    if (touch) updateHoverFromTouch(touch, rootEl, isRTLEvent(event))
  }

  function handleTouchMove(event: TouchEvent, rootEl: HTMLElement | null): void {
    if (!isInteractive()) return
    const touch = event.touches[0]
    if (touch) updateHoverFromTouch(touch, rootEl, isRTLEvent(event))
  }

  function handleTouchEnd(): void {
    if (!isInteractive()) return
    const committed = hoverValue.value
    hoverValue.value = 0
    emit('hover', 0)
    if (committed > 0) {
      emit('update:modelValue', committed)
      emit('change', committed)
    }
  }

  function handleTouchCancel(): void {
    hoverValue.value = 0
    emit('hover', 0)
  }

  return {
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
  }
}
