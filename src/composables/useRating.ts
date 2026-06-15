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

export function useRating(props: RatingProps, emit: EmitFn<RatingEmits>) {
  const hoverValue: Ref<number> = ref(0)

  function isInteractive(): boolean {
    return !props.readonly && !props.disabled
  }

  function handleClick(star: number): void {
    if (!isInteractive()) return
    emit('update:modelValue', star)
    emit('change', star)
  }

  function handleMouseEnter(star: number): void {
    if (!isInteractive()) return
    hoverValue.value = star
    emit('hover', star)
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

    let next: number

    switch (event.key) {
      case 'ArrowRight':
        next = clamp(current + step, 0, max)
        break
      case 'ArrowLeft':
        next = clamp(current - step, 0, max)
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
  }
}
