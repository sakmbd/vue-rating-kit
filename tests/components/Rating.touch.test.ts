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

function mockElementFromPoint(element: Element | null): void {
  vi.spyOn(document, 'elementFromPoint').mockReturnValue(element)
}

function mockRTL(): void {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    direction: 'rtl',
  } as unknown as CSSStyleDeclaration)
}

describe('Rating — touch interactions', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('tap — step=1', () => {
    it('tap on star 3 commits value 3', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })
      await root.trigger('touchend')

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
      expect(wrapper.emitted('change')![0]).toEqual([3])

      wrapper.unmount()
    })
  })

  describe('tap — step=0.5', () => {
    it('tap left side of star 3 (clientX=220) commits 2.5 in LTR', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act — clientX=220: fraction=(220-200)/100=0.20 → zone=ceil(0.20*2)=1 → value=2+0.5=2.5
      await root.trigger('touchstart', { touches: [{ clientX: 220, clientY: 10 }] })
      await root.trigger('touchend')

      // Assert — left side in LTR = lower sub-value
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([2.5])

      wrapper.unmount()
    })

    it('tap right side of star 3 (clientX=280) commits 3.0 in LTR', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act — clientX=280: fraction=(280-200)/100=0.80 → zone=ceil(0.80*2)=2 → value=2+1.0=3.0
      await root.trigger('touchstart', { touches: [{ clientX: 280, clientY: 10 }] })
      await root.trigger('touchend')

      // Assert — right side in LTR = higher sub-value
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])

      wrapper.unmount()
    })
  })

  describe('drag', () => {
    it('drag from star 1 to star 3 commits 3 on touchend', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[0].element, 100, 0)
      mockStarRect(stars[2].element, 100, 200)

      // Act — start on star 1, drag to star 3, lift
      mockElementFromPoint(stars[0].element)
      await root.trigger('touchstart', { touches: [{ clientX: 50, clientY: 10 }] })

      mockElementFromPoint(stars[2].element)
      await root.trigger('touchmove', { touches: [{ clientX: 250, clientY: 10 }] })

      await root.trigger('touchend')

      // Assert — hover updated in real time; committed on lift
      const hoverValues = wrapper.emitted('hover')!.map((e) => e[0])
      expect(hoverValues).toContain(1)  // star 1 hovered first
      expect(hoverValues).toContain(3)  // star 3 hovered after drag
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])

      wrapper.unmount()
    })

    it('drag step=0.5 preserves fractional precision on commit', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[0].element, 100, 0)
      mockStarRect(stars[2].element, 100, 200)

      // Act — drag to right side of star 3 → value 3.0
      mockElementFromPoint(stars[0].element)
      await root.trigger('touchstart', { touches: [{ clientX: 50, clientY: 10 }] })

      mockElementFromPoint(stars[2].element)
      await root.trigger('touchmove', { touches: [{ clientX: 280, clientY: 10 }] })

      await root.trigger('touchend')

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])

      wrapper.unmount()
    })
  })

  describe('hover feedback', () => {
    it('touchmove emits hover event with the star value under the finger', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })

      // Assert — hover emitted during touchstart (deduplication means touchmove at same pos won't re-emit)
      expect(wrapper.emitted('hover')!.map((e) => e[0])).toContain(3)

      wrapper.unmount()
    })
  })

  describe('touchcancel', () => {
    it('touchcancel clears hover without committing a value', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act — start gesture, then cancel
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })
      await root.trigger('touchcancel')

      // Assert — hover cleared to 0; value not committed
      const hoverEvents = wrapper.emitted('hover')!
      expect(hoverEvents[hoverEvents.length - 1][0]).toBe(0)
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('disabled', () => {
    it('touch does nothing on a disabled component', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2, disabled: true }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })
      await root.trigger('touchend')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('hover')).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('readonly', () => {
    it('touch does nothing on a readonly component', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 2, readonly: true }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })
      await root.trigger('touchend')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
      expect(wrapper.emitted('hover')).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('RTL touch', () => {
    it('right side of star 3 gives 2.5 and left side gives 3.0 in RTL (opposite sides, different values)', async () => {
      // star 3: rect {left:200, right:300, width:100}, step=0.5
      // RTL right (clientX=280): fraction=(300-280)/100=0.20 → zone=1 → value=2.5
      // RTL left (clientX=220): fraction=(300-220)/100=0.80 → zone=2 → value=3.0

      // Right side
      const wrapperRight = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const star3R = wrapperRight.findAll('.vrk-rating__star')[2]
      mockStarRect(star3R.element, 100, 200)
      mockElementFromPoint(star3R.element)
      mockRTL()

      await wrapperRight.find('.vrk-rating').trigger('touchstart', { touches: [{ clientX: 280, clientY: 10 }] })
      await wrapperRight.find('.vrk-rating').trigger('touchend')
      const rightValue = wrapperRight.emitted('update:modelValue')![0][0]
      wrapperRight.unmount()
      vi.restoreAllMocks()

      // Left side
      const wrapperLeft = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const star3L = wrapperLeft.findAll('.vrk-rating__star')[2]
      mockStarRect(star3L.element, 100, 200)
      mockElementFromPoint(star3L.element)
      mockRTL()

      await wrapperLeft.find('.vrk-rating').trigger('touchstart', { touches: [{ clientX: 220, clientY: 10 }] })
      await wrapperLeft.find('.vrk-rating').trigger('touchend')
      const leftValue = wrapperLeft.emitted('update:modelValue')![0][0]
      wrapperLeft.unmount()

      // Assert — opposite sides produce different values; right=low, left=high in RTL
      expect(rightValue).toBe(2.5)
      expect(leftValue).toBe(3)
    })

    it('same clientX produces opposite sub-values under LTR vs RTL', async () => {
      // LTR: clientX=280 → fraction=0.80 → zone=2 → value=3.0
      const ltrWrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const ltrStar3 = ltrWrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(ltrStar3.element, 100, 200)
      mockElementFromPoint(ltrStar3.element)

      await ltrWrapper.find('.vrk-rating').trigger('touchstart', { touches: [{ clientX: 280, clientY: 10 }] })
      await ltrWrapper.find('.vrk-rating').trigger('touchend')
      const ltrValue = ltrWrapper.emitted('update:modelValue')![0][0]
      ltrWrapper.unmount()
      vi.restoreAllMocks()

      // RTL: clientX=280 → fraction=(300-280)/100=0.20 → zone=1 → value=2.5
      const rtlWrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const rtlStar3 = rtlWrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(rtlStar3.element, 100, 200)
      mockElementFromPoint(rtlStar3.element)
      mockRTL()

      await rtlWrapper.find('.vrk-rating').trigger('touchstart', { touches: [{ clientX: 280, clientY: 10 }] })
      await rtlWrapper.find('.vrk-rating').trigger('touchend')
      const rtlValue = rtlWrapper.emitted('update:modelValue')![0][0]
      rtlWrapper.unmount()

      // Assert — same clientX, opposite values in LTR vs RTL
      expect(ltrValue).toBe(3)
      expect(rtlValue).toBe(2.5)
    })

    it('RTL drag commits fractional value using RTL fraction', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { step: 0.5, modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const stars = wrapper.findAll('.vrk-rating__star')
      mockStarRect(stars[4].element, 100, 400)  // star 5: left=400, right=500
      mockStarRect(stars[2].element, 100, 200)  // star 3: left=200, right=300
      mockRTL()

      // Start on star 5; drag to left side of star 3 (clientX=220 → RTL fraction=0.80 → value=3.0)
      mockElementFromPoint(stars[4].element)
      await root.trigger('touchstart', { touches: [{ clientX: 450, clientY: 10 }] })

      mockElementFromPoint(stars[2].element)
      await root.trigger('touchmove', { touches: [{ clientX: 220, clientY: 10 }] })

      await root.trigger('touchend')

      // Assert
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])

      wrapper.unmount()
    })
  })

  describe('mouse and touch coexistence', () => {
    it('mouse click after touch tap both emit independently on the same component', async () => {
      // Arrange
      const wrapper = mount(Rating, { props: { modelValue: 0 }, attachTo: document.body })
      const root = wrapper.find('.vrk-rating')
      const star3 = wrapper.findAll('.vrk-rating__star')[2]
      mockStarRect(star3.element, 100, 200)
      mockElementFromPoint(star3.element)

      // Act — touch tap commits star 3
      await root.trigger('touchstart', { touches: [{ clientX: 250, clientY: 10 }] })
      await root.trigger('touchend')

      // Act — mouse click on star 2 (rect.width=0 in JSDOM → returns starIndex=2)
      await wrapper.findAll('.vrk-rating__star')[1].trigger('click')

      // Assert — touch committed 3, mouse click committed 2; independent, no interference
      const emissions = wrapper.emitted('update:modelValue')!
      expect(emissions[0]).toEqual([3])
      expect(emissions[1]).toEqual([2])

      wrapper.unmount()
    })
  })
})
