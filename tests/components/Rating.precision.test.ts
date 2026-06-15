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

describe('Rating — visual rendering (partial fill)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('DOM structure', () => {
    it('each star contains a track span and a fill span', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      stars.forEach((star) => {
        expect(star.find('.vrk-rating__star-track').exists()).toBe(true)
        expect(star.find('.vrk-rating__star-fill').exists()).toBe(true)
      })
    })

    it('inner spans are aria-hidden', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const star = wrapper.findAll('.vrk-rating__star')[0]

      expect(star.find('.vrk-rating__star-track').attributes('aria-hidden')).toBe('true')
      expect(star.find('.vrk-rating__star-fill').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('fill width — modelValue', () => {
    it('all fills are 0% when modelValue=0', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      fills.forEach((fill) => {
        expect((fill.element as HTMLElement).style.width).toBe('0%')
      })
    })

    it('fills are 100% for stars 1–3 and 0% for stars 4–5 when modelValue=3', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3 } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[0].element as HTMLElement).style.width).toBe('100%')
      expect((fills[1].element as HTMLElement).style.width).toBe('100%')
      expect((fills[2].element as HTMLElement).style.width).toBe('100%')
      expect((fills[3].element as HTMLElement).style.width).toBe('0%')
      expect((fills[4].element as HTMLElement).style.width).toBe('0%')
    })

    it('star 3 fill is 50% when step=0.5 and modelValue=2.5', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5 } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[1].element as HTMLElement).style.width).toBe('100%')
      expect((fills[2].element as HTMLElement).style.width).toBe('50%')
      expect((fills[3].element as HTMLElement).style.width).toBe('0%')
    })

    it('star 3 fill is 75% when step=0.25 and modelValue=2.75', () => {
      const wrapper = mount(Rating, { props: { step: 0.25, modelValue: 2.75 } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[2].element as HTMLElement).style.width).toBe('75%')
    })
  })

  describe('--partial class', () => {
    it('star 3 has --partial when step=0.5 and modelValue=2.5', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      expect(stars[2].classes('vrk-rating__star--partial')).toBe(true)
      expect(stars[0].classes('vrk-rating__star--partial')).toBe(false)
      expect(stars[1].classes('vrk-rating__star--partial')).toBe(false)
      expect(stars[3].classes('vrk-rating__star--partial')).toBe(false)
      expect(stars[4].classes('vrk-rating__star--partial')).toBe(false)
    })

    it('no star has --partial for integer modelValue=3', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 3 } })
      const stars = wrapper.findAll('.vrk-rating__star')

      stars.forEach((star) => {
        expect(star.classes('vrk-rating__star--partial')).toBe(false)
      })
    })

    it('--partial is suppressed during hover (hoverValue > 0)', async () => {
      // Arrange — star 3 is initially partial
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[3].element)

      // Act — hover into star 4 zone (hoverValue=4.0), clearing partial state
      await stars[3].trigger('mousemove', { clientX: 80 })

      // Assert
      expect(stars[2].classes('vrk-rating__star--partial')).toBe(false)
    })
  })

  describe('mutual exclusion — --filled and --hover never co-exist', () => {
    it('no star has both --filled and --hover simultaneously', async () => {
      // Arrange — modelValue=3, hover at 1.5 (hoverValue = star 1 right half)
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 3 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[1].element)

      // Act — clientX=80 on star 2 → hoverValue=1.5
      await stars[1].trigger('mousemove', { clientX: 80 })

      // Assert — no star should have both classes at once
      stars.forEach((star) => {
        const hasFilled = star.classes('vrk-rating__star--filled')
        const hasHover = star.classes('vrk-rating__star--hover')
        expect(hasFilled && hasHover).toBe(false)
      })
    })

    it('--filled is preserved on stars above the hover range (Phase 1 parity)', async () => {
      // Arrange — modelValue=3, hover at star 1's right half (hoverValue=1.5)
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 3 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[0].element)

      // Act — clientX=80 on star 1 → hoverValue=1.0 (right half of star 1 = zone 2 = 1.0)
      await stars[0].trigger('mousemove', { clientX: 80 })

      // Assert — stars 2 and 3 are above hover range (Math.ceil(1.0)=1) but within modelValue=3
      // They should retain --filled (not become gray)
      expect(stars[1].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[2].classes('vrk-rating__star--filled')).toBe(true)
      // Star 1 is IN the hover range → --hover, NOT --filled
      expect(stars[0].classes('vrk-rating__star--hover')).toBe(true)
      expect(stars[0].classes('vrk-rating__star--filled')).toBe(false)
    })
  })

  describe('fill width — hover state', () => {
    it('fill width uses hoverValue during hover', async () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[2].element)

      // clientX=30 → fraction=0.3 → zone=1 → hoverValue=2.5
      await stars[2].trigger('mousemove', { clientX: 30 })

      const fills = wrapper.findAll('.vrk-rating__star-fill')
      expect((fills[2].element as HTMLElement).style.width).toBe('50%')
    })

    it('fill width reverts to modelValue after mouseleave', async () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[2].element)

      await stars[2].trigger('mousemove', { clientX: 30 })
      await stars[2].trigger('mouseleave')

      const fills = wrapper.findAll('.vrk-rating__star-fill')
      expect((fills[2].element as HTMLElement).style.width).toBe('0%')
    })
  })

  describe('disabled and readonly — fill spans still render', () => {
    it('disabled star retains fill span at correct width', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5, disabled: true } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[2].element as HTMLElement).style.width).toBe('50%')
    })

    it('readonly star retains fill span at correct width', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5, readonly: true } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[2].element as HTMLElement).style.width).toBe('50%')
    })

    it('filled disabled stars retain --filled class (rating value is preserved)', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2, disabled: true } })
      const stars = wrapper.findAll('.vrk-rating__star')

      expect(stars[0].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[1].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[2].classes('vrk-rating__star--filled')).toBe(false)
      expect(stars[3].classes('vrk-rating__star--filled')).toBe(false)
      expect(stars[4].classes('vrk-rating__star--filled')).toBe(false)
    })

    it('fill widths reflect modelValue for disabled integer rating', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2, disabled: true } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[0].element as HTMLElement).style.width).toBe('100%')
      expect((fills[1].element as HTMLElement).style.width).toBe('100%')
      expect((fills[2].element as HTMLElement).style.width).toBe('0%')
      expect((fills[3].element as HTMLElement).style.width).toBe('0%')
      expect((fills[4].element as HTMLElement).style.width).toBe('0%')
    })

    it('partial fill is correct for disabled fractional modelValue', () => {
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 2.5, disabled: true } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')

      expect((fills[1].element as HTMLElement).style.width).toBe('100%')
      expect((fills[2].element as HTMLElement).style.width).toBe('50%')
      expect((fills[3].element as HTMLElement).style.width).toBe('0%')
    })
  })
})
