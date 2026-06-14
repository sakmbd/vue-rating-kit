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
})
