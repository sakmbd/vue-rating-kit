import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import Rating from '../../src/components/Rating.vue'

// The live region is injected as a DOM sibling of the radiogroup div via onMounted.
// wrapper.element is the radiogroup div (single root), so nextElementSibling is the span.
function getLiveRegion(wrapper: ReturnType<typeof mount>): Element | null {
  return (wrapper.element as HTMLElement).nextElementSibling
}

describe('Rating — accessibility improvements', () => {
  describe('aria-checked — fractional modelValues', () => {
    it('aria-checked is true for the ceiling star when modelValue is fractional (2.5 → star 3)', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2.5, step: 0.5 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      expect(stars[0].attributes('aria-checked')).toBe('false')
      expect(stars[1].attributes('aria-checked')).toBe('false')
      expect(stars[2].attributes('aria-checked')).toBe('true')
      expect(stars[3].attributes('aria-checked')).toBe('false')
      expect(stars[4].attributes('aria-checked')).toBe('false')

      wrapper.unmount()
    })

    it('aria-checked is false for all stars when modelValue=0', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      stars.forEach(star => {
        expect(star.attributes('aria-checked')).toBe('false')
      })

      wrapper.unmount()
    })

    it('aria-checked is correct for integer modelValue=3 (regression guard)', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      stars.forEach((star, index) => {
        expect(star.attributes('aria-checked')).toBe(index === 2 ? 'true' : 'false')
      })

      wrapper.unmount()
    })
  })

  describe('live region', () => {
    it('live region is a sibling of the radiogroup (outside the radiogroup element)', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })

      // The radiogroup must NOT contain the live region
      expect(wrapper.find('[role="status"]').exists()).toBe(false)

      // The live region must exist as the next sibling after the radiogroup
      const liveRegion = getLiveRegion(wrapper)
      expect(liveRegion).not.toBeNull()
      expect(liveRegion!.getAttribute('role')).toBe('status')
      expect(liveRegion!.getAttribute('aria-live')).toBe('polite')
      expect(liveRegion!.getAttribute('aria-atomic')).toBe('true')

      wrapper.unmount()
    })

    it('live region text is empty on mount when modelValue=0', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const liveRegion = getLiveRegion(wrapper)

      expect(liveRegion!.textContent!.trim()).toBe('')

      wrapper.unmount()
    })

    it('live region announces precise value when sub-step change stays within the same star (3 of 5 stars)', async () => {
      // Start at 2.5 (ceil=3); move to 3.0 (ceil=3) — same star, live region must fire
      const wrapper = mount(Rating, { props: { modelValue: 2.5, step: 0.5, max: 5 } })

      await wrapper.setProps({ modelValue: 3.0 })
      await nextTick()

      const liveRegion = getLiveRegion(wrapper)
      expect(liveRegion!.textContent!.trim()).toBe('3 of 5 stars')

      wrapper.unmount()
    })

    it('live region announces fractional value when sub-step change stays within the same star (2.5 of 5 stars)', async () => {
      // Start at 3.0 (ceil=3); move to 2.5 (ceil=3) — same star, live region must fire
      const wrapper = mount(Rating, { props: { modelValue: 3.0, step: 0.5, max: 5 } })

      await wrapper.setProps({ modelValue: 2.5 })
      await nextTick()

      const liveRegion = getLiveRegion(wrapper)
      expect(liveRegion!.textContent!.trim()).toBe('2.5 of 5 stars')

      wrapper.unmount()
    })

    it('live region stays silent when modelValue changes to a different star (ceil changes)', async () => {
      // Start at 2 (ceil=2); move to 3 (ceil=3) — different star, no live region announcement
      const wrapper = mount(Rating, { props: { modelValue: 2 } })

      await wrapper.setProps({ modelValue: 3 })
      await nextTick()

      const liveRegion = getLiveRegion(wrapper)
      expect(liveRegion!.textContent!.trim()).toBe('')

      wrapper.unmount()
    })
  })
})
