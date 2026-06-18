import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Rating from '../../src/components/Rating.vue'

function getStyle(wrapper: ReturnType<typeof mount>) {
  return (wrapper.find('.vrk-rating').element as HTMLElement).style
}

describe('Rating — hoverColor prop', () => {
  describe('no hover props', () => {
    it('does not write --vrk-color-hover-prop or --vrk-color-hover inline', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-hover-prop')).toBe('')
      expect(style.getPropertyValue('--vrk-color-hover')).toBe('')
    })
  })

  describe('color prop alone (auto-inheritance)', () => {
    it('sets --vrk-color-filled but not --vrk-color-hover-prop', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: 'green' } })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('green')
      expect(style.getPropertyValue('--vrk-color-hover-prop')).toBe('')
    })

    it('does not write --vrk-color-hover inline (consumer CSS can still override it)', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: 'green' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-hover')).toBe('')
    })
  })

  describe('hoverColor prop alone', () => {
    it('sets --vrk-color-hover-prop to the given value', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, hoverColor: 'darkgreen' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-hover-prop')).toBe('darkgreen')
    })

    it('accepts hex values', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, hoverColor: '#006400' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-hover-prop')).toBe('#006400')
    })
  })

  describe('color + hoverColor together', () => {
    it('sets both --vrk-color-filled and --vrk-color-hover-prop', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, color: 'green', hoverColor: 'darkgreen' },
      })
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('green')
      expect(style.getPropertyValue('--vrk-color-hover-prop')).toBe('darkgreen')
    })
  })

  describe('CSS variable precedence preserved', () => {
    it('never writes --vrk-color-hover inline even when hoverColor prop is set', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, color: 'green', hoverColor: 'darkgreen' },
      })
      // --vrk-color-hover must remain unset inline so consumer CSS can override it
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-hover')).toBe('')
    })
  })

  describe('existing color prop behavior unchanged', () => {
    it('color prop still sets --vrk-color-filled correctly', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: '#e63946' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-filled')).toBe('#e63946')
    })

    it('emptyColor prop still sets --vrk-color-empty correctly', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0, emptyColor: '#ccc' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-empty')).toBe('#ccc')
    })

    it('--vrk-color-empty is absent when only color is provided', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3, color: 'green' } })
      expect(getStyle(wrapper).getPropertyValue('--vrk-color-empty')).toBe('')
    })
  })

  describe('coexistence with size', () => {
    it('size class and hoverColor variable are both applied without collision', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, size: 'lg', color: 'green', hoverColor: 'darkgreen' },
      })
      expect(wrapper.find('.vrk-rating').classes('vrk-rating--lg')).toBe(true)
      const style = getStyle(wrapper)
      expect(style.getPropertyValue('--vrk-color-filled')).toBe('green')
      expect(style.getPropertyValue('--vrk-color-hover-prop')).toBe('darkgreen')
    })
  })
})
