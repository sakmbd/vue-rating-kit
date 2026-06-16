// Global test setup for vue-rating-kit.
// Configure @vue/test-utils or shared test utilities here when needed.

// JSDOM does not implement document.elementFromPoint as an own property,
// so vi.spyOn cannot intercept it without this stub.
if (typeof document.elementFromPoint !== 'function') {
  document.elementFromPoint = () => null
}
