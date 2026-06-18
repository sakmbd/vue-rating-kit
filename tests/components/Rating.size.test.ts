import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Rating from '../../src/components/Rating.vue'

describe('Rating — size prop', () => {
  describe('default (no size prop)', () => {
    it('applies no size modifier class', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const root = wrapper.find('.vrk-rating')
      expect(root.classes('vrk-rating--sm')).toBe(false)
      expect(root.classes('vrk-rating--md')).toBe(false)
      expect(root.classes('vrk-rating--lg')).toBe(false)
    })

    it('applies no inline size style', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const el = wrapper.find('.vrk-rating').element as HTMLElement
      expect(el.style.getPropertyValue('--vrk-star-size')).toBe('')
    })
  })

  describe('named presets', () => {
    it('applies vrk-rating--sm for size="sm"', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 'sm' } })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--sm')).toBe(true)
    })

    it('applies vrk-rating--md for size="md"', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 'md' } })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--md')).toBe(true)
    })

    it('applies vrk-rating--lg for size="lg"', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 'lg' } })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--lg')).toBe(true)
    })

    it('applies only one size modifier class at a time', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 'lg' } })
      const root = wrapper.find('.vrk-rating')
      expect(root.classes('vrk-rating--lg')).toBe(true)
      expect(root.classes('vrk-rating--sm')).toBe(false)
      expect(root.classes('vrk-rating--md')).toBe(false)
    })

    it('applies no inline size style for named presets', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 'lg' } })
      const el = wrapper.find('.vrk-rating').element as HTMLElement
      expect(el.style.getPropertyValue('--vrk-star-size')).toBe('')
    })
  })

  describe('numeric size', () => {
    it('applies no preset modifier class for a numeric size', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 40 } })
      const root = wrapper.find('.vrk-rating')
      expect(root.classes('vrk-rating--sm')).toBe(false)
      expect(root.classes('vrk-rating--md')).toBe(false)
      expect(root.classes('vrk-rating--lg')).toBe(false)
    })

    it('sets --vrk-star-size inline style for a numeric size', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, size: 40 } })
      const el = wrapper.find('.vrk-rating').element as HTMLElement
      expect(el.style.getPropertyValue('--vrk-star-size')).toBe('40px')
    })

    it('renders all stars correctly with a numeric size', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, size: 40 } })
      const stars = wrapper.findAll('.vrk-rating__star')
      expect(stars).toHaveLength(5)
      expect(stars[2].classes('vrk-rating__star--filled')).toBe(true)
    })
  })

  describe('size with state modifier classes', () => {
    it('state classes are still applied when size is set', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, size: 'sm' } })
      const stars = wrapper.findAll('.vrk-rating__star')
      expect(stars[0].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[1].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[2].classes('vrk-rating__star--filled')).toBe(true)
      expect(stars[3].classes('vrk-rating__star--filled')).toBe(false)
    })

    it('readonly class is still applied when size is set', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2, size: 'md', readonly: true } })
      const root = wrapper.find('.vrk-rating')
      expect(root.classes('vrk-rating--md')).toBe(true)
      wrapper.findAll('.vrk-rating__star').forEach((star) => {
        expect(star.classes('vrk-rating__star--readonly')).toBe(true)
      })
    })

    it('disabled class is still applied when size is set', () => {
      const wrapper = mount(Rating, { props: { modelValue: 2, size: 'lg', disabled: true } })
      const root = wrapper.find('.vrk-rating')
      expect(root.classes('vrk-rating--lg')).toBe(true)
      wrapper.findAll('.vrk-rating__star').forEach((star) => {
        expect(star.classes('vrk-rating__star--disabled')).toBe(true)
      })
    })
  })

  describe('size with custom slots', () => {
    it('size class is present and slot content renders', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 2, size: 'lg' },
        slots: { filled: '❤️', empty: '🤍' },
      })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--lg')).toBe(true)
      wrapper.findAll('.vrk-rating__star-track').forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })
  })
})
