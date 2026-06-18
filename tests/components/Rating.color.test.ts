import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Rating from '../../src/components/Rating.vue'

function getStyle(wrapper: ReturnType<typeof mount>) {
  return (wrapper.find('.vrk-rating').element as HTMLElement).style
}

describe('Rating — color props', () => {
  describe('default (no color props)', () => {
    it('sets no inline color variables', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('')
      expect(style.getPropertyValue('--vrk-color-empty')).toBe('')
    })
  })

  describe('color prop', () => {
    it('sets --vrk-color-filled on the root element', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: 'red' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('red')
    })

    it('does not set --vrk-color-empty when only color is provided', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: 'red' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-empty')).toBe('')
    })

    it('accepts hex values', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: '#e63946' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('#e63946')
    })
  })

  describe('emptyColor prop', () => {
    it('sets --vrk-color-empty on the root element', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, emptyColor: '#ccc' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-empty')).toBe('#ccc')
    })

    it('does not set --vrk-color-filled when only emptyColor is provided', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, emptyColor: '#ccc' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('')
    })
  })

  describe('both props together', () => {
    it('sets both --vrk-color-filled and --vrk-color-empty', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, color: '#e63946', emptyColor: '#dee2e6' },
      })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('#e63946')
      expect(style.getPropertyValue('--vrk-color-empty')).toBe('#dee2e6')
    })
  })

  describe('color with slot content', () => {
    it('color variable is set and slot content renders correctly', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 2, color: 'crimson', emptyColor: '#eee' },
        slots: { filled: '❤️', empty: '🤍' },
      })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('crimson')
      expect(style.getPropertyValue('--vrk-color-empty')).toBe('#eee')
      wrapper.findAll('.vrk-rating__star-track').forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })
  })

  describe('coexistence with size', () => {
    it('size class and color variables are both applied without collision', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, size: 'lg', color: 'tomato', emptyColor: '#ddd' },
      })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--lg')).toBe(true)
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('tomato')
      expect(style.getPropertyValue('--vrk-color-empty')).toBe('#ddd')
    })

    it('numeric size and color variables are both applied without collision', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, size: 40, color: 'steelblue' },
      })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-star-size')).toBe('40px')
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('steelblue')
    })
  })

  describe('color with readonly', () => {
    it('color variable is set and interaction is blocked', async () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, readonly: true, color: 'purple' },
      })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('purple')
      await wrapper.findAll('.vrk-rating__star')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('color with disabled', () => {
    it('color variable is set and interaction is blocked', async () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, disabled: true, color: 'purple' },
      })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('purple')
      await wrapper.findAll('.vrk-rating__star')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })
})
