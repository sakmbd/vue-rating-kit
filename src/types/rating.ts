// TODO: Define and export all public types for the Rating component
//
// RatingValue
//   A valid rating number constrained to [0, max].
//   Using a branded or aliased type improves readability in consumer code.
//
// RatingProps
//   modelValue : RatingValue  — controlled rating value (v-model)
//   max        : number       — total stars (default: DEFAULT_MAX)
//   readonly   : boolean      — read-only display mode
//   disabled   : boolean      — disabled interaction mode
//
// RatingEmits
//   'update:modelValue' : [value: RatingValue]  — emitted on user selection
//
// Rules:
//   - No use of `any`
//   - All types must be exported for consumer IntelliSense
//   - All props must have JSDoc comments for IDE tooltip support
