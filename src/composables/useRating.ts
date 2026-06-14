import { ref } from 'vue'
import type { Ref, EmitFn } from 'vue'
import { clamp } from '../utils/clamp'
import { DEFAULT_MAX, DEFAULT_VALUE, NAVIGATION_KEYS } from '../constants'
import type { RatingProps, RatingEmits } from '../types/rating'

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

    let next: number

    switch (event.key) {
      case 'ArrowRight':
        next = clamp(current + 1, 0, max)
        break
      case 'ArrowLeft':
        next = clamp(current - 1, 0, max)
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
