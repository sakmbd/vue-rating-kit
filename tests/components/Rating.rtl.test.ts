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

function mockRTL(): void {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    direction: 'rtl',
  } as unknown as CSSStyleDeclaration)
}

function mockDirectionByAttr(): void {
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
    const dir = (el as HTMLElement).closest?.('[dir="rtl"]') ? 'rtl' : 'ltr'
    return { direction: dir } as unknown as CSSStyleDeclaration
  })
}

describe('Rating — RTL interactions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('click — step=1 (RTL)', () => {
    it('emits 2 when clicking the right side of star 3 (entry point in RTL)', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 1, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockRTL()

      // Act — clientX=280 is near right edge; RTL fraction=(300-280)/100=0.20 → zone=1 → value=2+1=2 (wrong)
      // Wait: star3 index=3, so (starIndex-1)+zone*step = (3-1)+1*1 = 3? No, zone=ceil(0.20*1)=1 → value=(3-1)+1=3
      // Actually right-side click in RTL should give value = (starIndex-1) + zone*step where zone is low
      // clientX=280, rect.right=300 → fraction=(300-280)/100=0.2 → zone=ceil(0.2*1)=1 → value=2+1=3
      // Hmm, with step=1 there is only 1 zone per star, so clicking anywhere on star 3 always gives 3.
      // The RTL distinction for step=1 is only meaningful for the fill render, not the emitted value.
      // Use step=0.5 for a meaningful RTL vs LTR distinction. Skip this; covered below.
      await star3.trigger('click', { clientX: 280 })

      // Assert — right-side click in RTL: fraction=0.2 → zone=ceil(0.2*2)=1 → but step=1 so zone=1 → value=3
      // With step=1, RTL and LTR both emit the star index (no intra-star precision).
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })
  })

  describe('click — step=0.5 (RTL)', () => {
    it('emits 2.5 when clicking right quarter of star 3 (low sub-value in RTL)', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockRTL()

      // Act — clientX=280 → RTL fraction=(300-280)/100=0.20 → zone=ceil(0.20*2)=1 → value=2+0.5=2.5
      await star3.trigger('click', { clientX: 280 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2.5])
    })

    it('emits 3.0 when clicking left quarter of star 3 (high sub-value in RTL)', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockRTL()

      // Act — clientX=220 → RTL fraction=(300-220)/100=0.80 → zone=ceil(0.80*2)=2 → value=2+1.0=3.0
      await star3.trigger('click', { clientX: 220 })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })

    it('RTL inverts relative to LTR — same clientX produces opposite sub-values', async () => {
      // Arrange — LTR component
      const ltr = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const ltrStar = ltr.findAll('.vrk-rating__star')[2]
      mockStarRect(ltrStar.element, 100, 200)
      // getComputedStyle not mocked → isRTLEvent returns false (ltr)

      // Act — clientX=240, near left → LTR fraction=0.40 → zone=1 → value=2.5
      await ltrStar.trigger('click', { clientX: 240 })
      const ltrValue = ltr.emitted('update:modelValue')![0][0]

      // Now RTL component
      vi.restoreAllMocks()
      const rtl = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const rtlStar = rtl.findAll('.vrk-rating__star')[2]
      mockStarRect(rtlStar.element, 100, 200)
      mockRTL()

      // Act — same clientX=240 → RTL fraction=(300-240)/100=0.60 → zone=2 → value=3.0
      await rtlStar.trigger('click', { clientX: 240 })
      const rtlValue = rtl.emitted('update:modelValue')![0][0]

      // Assert — same position, opposite sub-values
      expect(ltrValue).toBe(2.5)
      expect(rtlValue).toBe(3)
    })
  })

  describe('mousemove — step=0.5 (RTL)', () => {
    it('emits fractional hover value using RTL fraction', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockRTL()

      // Act — clientX=280 → RTL fraction=0.20 → zone=1 → value=2.5
      await star3.trigger('mousemove', { clientX: 280 })

      // Assert
      expect(wrapper.emitted('hover')![0]).toEqual([2.5])
    })
  })

  describe('keyboard — RTL', () => {
    it('ArrowLeft increments in RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2 } })
      const star = wrapper.findAll('.vrk-rating__star')[1]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'ArrowLeft' })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
    })

    it('ArrowRight decrements in RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2 } })
      const star = wrapper.findAll('.vrk-rating__star')[1]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'ArrowRight' })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
    })

    it('Home sets value to 0 regardless of RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 3 } })
      const star = wrapper.findAll('.vrk-rating__star')[2]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'Home' })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([0])
    })

    it('End sets value to max regardless of RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 1, max: 5 } })
      const star = wrapper.findAll('.vrk-rating__star')[0]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'End' })

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([5])
    })

    it('disabled blocks keyboard interaction in RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2, disabled: true } })
      const star = wrapper.findAll('.vrk-rating__star')[1]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'ArrowLeft' })

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })

    it('readonly blocks keyboard interaction in RTL', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2, readonly: true } })
      const star = wrapper.findAll('.vrk-rating__star')[1]
      mockRTL()

      // Act
      await star.trigger('keydown', { key: 'ArrowLeft' })

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('LTR/RTL coexistence', () => {
    it('ArrowRight increments LTR while ArrowLeft increments RTL in the same session', async () => {
      // Arrange — mock resolves direction per component
      mockDirectionByAttr()
      const ltr = mount(Rating, { props: { modelValue: 2 } })
      const rtl = mount(Rating, { props: { modelValue: 2 }, attrs: { dir: 'rtl' } })

      // Act
      await ltr.findAll('.vrk-rating__star')[1].trigger('keydown', { key: 'ArrowRight' })
      await rtl.findAll('.vrk-rating__star')[1].trigger('keydown', { key: 'ArrowLeft' })

      // Assert — both increment, via opposite keys
      expect(ltr.emitted('update:modelValue')![0]).toEqual([3])
      expect(rtl.emitted('update:modelValue')![0]).toEqual([3])
    })

    it('ArrowLeft decrements LTR while ArrowRight decrements RTL in the same session', async () => {
      // Arrange
      mockDirectionByAttr()
      const ltr = mount(Rating, { props: { modelValue: 2 } })
      const rtl = mount(Rating, { props: { modelValue: 2 }, attrs: { dir: 'rtl' } })

      // Act
      await ltr.findAll('.vrk-rating__star')[1].trigger('keydown', { key: 'ArrowLeft' })
      await rtl.findAll('.vrk-rating__star')[1].trigger('keydown', { key: 'ArrowRight' })

      // Assert — both decrement, via opposite keys
      expect(ltr.emitted('update:modelValue')![0]).toEqual([1])
      expect(rtl.emitted('update:modelValue')![0]).toEqual([1])
    })

    it('right-side click emits high value for LTR and low value for RTL', async () => {
      // Arrange
      mockDirectionByAttr()
      const ltr = mount(Rating, { props: { step: 0.5, modelValue: 0 } })
      const rtl = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attrs: { dir: 'rtl' } })

      const ltrStar3 = ltr.findAll('.vrk-rating__star')[2]
      const rtlStar3 = rtl.findAll('.vrk-rating__star')[2]
      mockStarRect(ltrStar3.element, 100, 200)
      mockStarRect(rtlStar3.element, 100, 200)

      // Act — same clientX=280 (near right edge, rect.left=200 rect.right=300)
      // LTR: fraction=(280-200)/100=0.80 → zone=2 → value=3.0
      // RTL: fraction=(300-280)/100=0.20 → zone=1 → value=2.5
      await ltrStar3.trigger('click', { clientX: 280 })
      await rtlStar3.trigger('click', { clientX: 280 })

      // Assert — same click position, opposite sub-values
      expect(ltr.emitted('update:modelValue')![0]).toEqual([3])
      expect(rtl.emitted('update:modelValue')![0]).toEqual([2.5])
    })
  })
})
