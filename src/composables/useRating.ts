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

function computeStarValue(event: MouseEvent, starIndex: number, step: number, rtl: boolean): number {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  if (rect.width <= 0) return starIndex
  const rawFraction = rtl
    ? (rect.right - event.clientX) / rect.width
    : (event.clientX - rect.left) / rect.width
  const fraction = clamp(rawFraction, 0, 1)
  const zonesPerStar = 1 / step
  const zone = Math.max(1, Math.ceil(fraction * zonesPerStar))
  return (starIndex - 1) + zone * step
}

export function useRating(props: RatingProps, emit: EmitFn<RatingEmits>) {
  const hoverValue: Ref<number> = ref(0)

  function isInteractive(): boolean {
    return !props.readonly && !props.disabled
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

  return {
    hoverValue,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    handleKeydown,
    handleMouseMove,
  }
}
