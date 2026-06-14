import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Rating from '../../src/components/Rating.vue'

describe('Rating', () => {
  it('renders 5 stars by default', () => {
    // Arrange
    const wrapper = mount(Rating)

    // Act
    const stars = wrapper.findAll('.vrk-rating__star')

    // Assert
    expect(stars).toHaveLength(5)
  })

  it('renders custom max stars', () => {
    // Arrange
    const wrapper = mount(Rating, {
      props: { max: 3 },
    })

    // Act
    const stars = wrapper.findAll('.vrk-rating__star')

    // Assert
    expect(stars).toHaveLength(3)
  })

  it('emits update:modelValue on click', async () => {
    // Arrange
    const wrapper = mount(Rating, {
      props: { modelValue: 0 },
    })

    // Act — trigger click on the third star (findAll index 2 = star value 3)
    await wrapper.findAll('.vrk-rating__star')[2].trigger('click')

    // Assert
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3])
  })

  it('readonly prevents value changes', async () => {
    // Arrange
    const wrapper = mount(Rating, {
      props: { modelValue: 2, readonly: true },
    })

    // Act — attempt to click the fourth star (findAll index 3 = star value 4)
    await wrapper.findAll('.vrk-rating__star')[3].trigger('click')

    // Assert
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('disabled prevents value changes', async () => {
    // Arrange
    const wrapper = mount(Rating, {
      props: { modelValue: 2, disabled: true },
    })

    // Act — attempt to click the fourth star (findAll index 3 = star value 4)
    await wrapper.findAll('.vrk-rating__star')[3].trigger('click')

    // Assert
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  describe('hover', () => {
    it('emits hover event on mouse enter', async () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { modelValue: 0 },
      })

      // Act — mouseenter the third star (findAll index 2 = star value 3)
      await wrapper.findAll('.vrk-rating__star')[2].trigger('mouseenter')

      // Assert
      expect(wrapper.emitted('hover')).toBeTruthy()
      expect(wrapper.emitted('hover')![0]).toEqual([3])
    })

    it('resets hover state on mouse leave', async () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { modelValue: 0 },
      })
      const stars = wrapper.findAll('.vrk-rating__star')
      await stars[2].trigger('mouseenter')

      // Act
      await stars[2].trigger('mouseleave')

      // Assert — second hover emission carries value 0 (no star hovered)
      expect(wrapper.emitted('hover')![1]).toEqual([0])
      stars.forEach(star => {
        expect(star.classes('vrk-rating__star--hover')).toBe(false)
      })
    })

    it('applies hover class to stars up to the hovered star', async () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { modelValue: 0 },
      })
      const stars = wrapper.findAll('.vrk-rating__star')

      // Act — mouseenter the third star (value 3)
      await stars[2].trigger('mouseenter')

      // Assert — stars 1–3 receive hover class; stars 4–5 do not
      expect(stars[0].classes('vrk-rating__star--hover')).toBe(true)
      expect(stars[1].classes('vrk-rating__star--hover')).toBe(true)
      expect(stars[2].classes('vrk-rating__star--hover')).toBe(true)
      expect(stars[3].classes('vrk-rating__star--hover')).toBe(false)
      expect(stars[4].classes('vrk-rating__star--hover')).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('root has radiogroup role', () => {
      // Arrange
      const wrapper = mount(Rating)

      // Act
      const role = wrapper.attributes('role')

      // Assert
      expect(role).toBe('radiogroup')
    })

    it('stars have radio role', () => {
      // Arrange
      const wrapper = mount(Rating)

      // Act
      const stars = wrapper.findAll('.vrk-rating__star')

      // Assert
      stars.forEach(star => {
        expect(star.attributes('role')).toBe('radio')
      })
    })

    it('aria-checked reflects the selected star', () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { modelValue: 3 },
      })

      // Act
      const stars = wrapper.findAll('.vrk-rating__star')

      // Assert
      expect(stars[2].attributes('aria-checked')).toBe('true')
      expect(stars[0].attributes('aria-checked')).toBe('false')
    })

    it('aria-label is applied to the root element', () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { ariaLabel: 'Product quality rating' },
      })

      // Act
      const label = wrapper.attributes('aria-label')

      // Assert
      expect(label).toBe('Product quality rating')
    })

    it('disabled sets aria-disabled on the root', () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { disabled: true },
      })

      // Act
      const ariaDisabled = wrapper.attributes('aria-disabled')

      // Assert
      expect(ariaDisabled).toBe('true')
    })

    it('readonly sets aria-readonly on the root', () => {
      // Arrange
      const wrapper = mount(Rating, {
        props: { readonly: true },
      })

      // Act
      const ariaReadonly = wrapper.attributes('aria-readonly')

      // Assert
      expect(ariaReadonly).toBe('true')
    })
  })
})
