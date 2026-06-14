// TODO: Implement useRating composable
//
// Accepts:
//   props : RatingProps  — reactive component props
//   emit  : RatingEmits  — component emit function
//
// Returns:
//   hoverValue       : Ref<number>   — star index currently under pointer (0 = none)
//   handleClick      : (star: number) => void  — sets modelValue, emits update:modelValue
//   handleMouseEnter : (star: number) => void  — sets hoverValue
//   handleMouseLeave : () => void              — clears hoverValue
//   handleKeydown    : (event: KeyboardEvent)  — Arrow keys, Home, End navigation
//
// Rules:
//   - Must respect readonly and disabled — no state changes when either is true
//   - Must clamp values to [0, props.max] using clamp() from utils
//   - Must not use Options API
//   - Must not use any
