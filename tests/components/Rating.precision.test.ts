import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Rating from '../../src/components/Rating.vue'

function mockStarRect(element: Element, width = 100, left = 0): void {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    width,
    height: 20,
    left,
    right: left + width,
    top: 0,
    bottom: 20,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('Rating — precision interactions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('click — step=0.5', () => {
    it('emits 2.5 when clicking left half of star 3', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act — clientX=30 → fraction=0.3 → zone=ceil(0.6)=1 → value=2+0.5=2.5
      await star3.trigger('click', { clientX: 30 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2.5])
    })

    it('emits 3.0 when clicking right half of star 3', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act — clientX=80 → fraction=0.8 → zone=ceil(1.6)=2 → value=2+1.0=3.0
      await star3.trigger('click', { clientX: 80 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })
  })

  describe('mousemove — step=0.5', () => {
    it('emits fractional hover value', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act
      await star3.trigger('mousemove', { clientX: 30 })

      // Assert
      expect(wrapper.emitted('hover')![0]).toEqual([2.5])
    })

    it('applies --hover class to star 3 when hoverValue is 2.5', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[2].element)

      // Act
      await stars[2].trigger('mousemove', { clientX: 30 })

      // Assert — Math.ceil(2.5)=3, so star 3 gets --hover
      expect(stars[2].classes('vrk-rating__star--hover')).toBe(true)
    })
  })

  describe('mouseenter — step=0.5', () => {
    it('delegates to handleMouseMove and emits fractional hover value', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act
      await star3.trigger('mouseenter', { clientX: 30 })

      // Assert — emits 2.5, not integer 3
      expect(wrapper.emitted('hover')![0]).toEqual([2.5])
    })

    it('does not double-emit when followed by mousemove at same position', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act — both events resolve to the same value (2.5); dedup guard suppresses second
      await star3.trigger('mouseenter', { clientX: 30 })
      await star3.trigger('mousemove', { clientX: 30 })

      // Assert — only one hover emission
      expect(wrapper.emitted('hover')).toHaveLength(1)
    })
  })

  describe('tabindex — fractional modelValue', () => {
    it('gives tabindex=0 to star 3 when modelValue is 2.5', () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      // Assert — Math.ceil(2.5)=3, so star 3 (index 2) gets tabindex=0
      expect(stars[2].attributes('tabindex')).toBe('0')
      expect(stars[0].attributes('tabindex')).toBe('-1')
      expect(stars[1].attributes('tabindex')).toBe('-1')
      expect(stars[3].attributes('tabindex')).toBe('-1')
      expect(stars[4].attributes('tabindex')).toBe('-1')
    })
  })

  describe('step validation — invalid step falls back to 1', () => {
    it('emits integer when step=0.3 is provided', async () => {
      // Arrange — step=0.3 is invalid (1/0.3 is not a whole number); falls back to step=1
      const wrapper = mount(Rating, { props: { step: 0.3, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act — with effective step=1, zone=1 always, value=3 (integer)
      await star3.trigger('click', { clientX: 30 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })
  })

  describe('step=0.25 — quarter precision', () => {
    it('emits 2.25 when clicking first quarter of star 3', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.25, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element)

      // Act — clientX=20 → fraction=0.2 → zonesPerStar=4 → zone=ceil(0.8)=1 → value=2+0.25=2.25
      await star3.trigger('click', { clientX: 20 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2.25])
    })
  })
})
