import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Rating from '../../src/components/Rating.vue'

describe('Rating — custom icon slots', () => {
  describe('default rendering (no slots)', () => {
    it('renders the default star character in track spans', () => {
      const wrapper = mount(Rating, { props: { modelValue: 0 } })
      const tracks = wrapper.findAll('.vrk-rating__star-track')
      expect(tracks).toHaveLength(5)
      tracks.forEach((track) => {
        expect(track.text()).toContain('★')
      })
    })

    it('renders the default star character in fill spans', () => {
      const wrapper = mount(Rating, { props: { modelValue: 3 } })
      const fills = wrapper.findAll('.vrk-rating__star-fill')
      expect(fills).toHaveLength(5)
      fills.forEach((fill) => {
        expect(fill.text()).toContain('★')
      })
    })
  })

  describe('#filled slot', () => {
    it('renders custom filled content in fill spans', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3 },
        slots: { filled: '❤️' },
      })
      const fills = wrapper.findAll('.vrk-rating__star-fill')
      fills.forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })

    it('does not affect track spans when only filled slot is provided', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3 },
        slots: { filled: '❤️' },
      })
      const tracks = wrapper.findAll('.vrk-rating__star-track')
      tracks.forEach((track) => {
        expect(track.text()).toContain('★')
      })
    })
  })

  describe('#empty slot', () => {
    it('renders custom empty content in track spans', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 0 },
        slots: { empty: '🤍' },
      })
      const tracks = wrapper.findAll('.vrk-rating__star-track')
      tracks.forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
    })

    it('does not affect fill spans when only empty slot is provided', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3 },
        slots: { empty: '🤍' },
      })
      const fills = wrapper.findAll('.vrk-rating__star-fill')
      fills.forEach((fill) => {
        expect(fill.text()).toContain('★')
      })
    })
  })

  describe('both slots together', () => {
    it('renders custom content in both track and fill spans', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3 },
        slots: { filled: '❤️', empty: '🤍' },
      })
      wrapper.findAll('.vrk-rating__star-track').forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })
  })

  describe('precision rendering with slots', () => {
    it('applies correct fill width to fill spans when step=0.5 and modelValue=2.5', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 2.5, step: 0.5 },
        slots: { filled: '❤️', empty: '🤍' },
      })
      const fills = wrapper.findAll('.vrk-rating__star-fill')
      // star 1 and 2 are fully filled (100%), star 3 is half-filled (50%)
      expect(fills[0].attributes('style')).toContain('width: 100%')
      expect(fills[1].attributes('style')).toContain('width: 100%')
      expect(fills[2].attributes('style')).toContain('width: 50%')
      // stars 4 and 5 are empty (0%)
      expect(fills[3].attributes('style')).toContain('width: 0%')
      expect(fills[4].attributes('style')).toContain('width: 0%')
    })

    it('slot content is still present in fill spans during precision rendering', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 2.5, step: 0.5 },
        slots: { filled: '❤️', empty: '🤍' },
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })
  })

  describe('readonly mode with slots', () => {
    it('renders custom slot content in readonly mode', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, readonly: true },
        slots: { filled: '❤️', empty: '🤍' },
      })
      wrapper.findAll('.vrk-rating__star-track').forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })

    it('does not emit update:modelValue when clicking in readonly mode with slots', async () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, readonly: true },
        slots: { filled: '❤️', empty: '🤍' },
      })
      await wrapper.findAll('.vrk-rating__star')[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('disabled mode with slots', () => {
    it('renders custom slot content in disabled mode', () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, disabled: true },
        slots: { filled: '❤️', empty: '🤍' },
      })
      wrapper.findAll('.vrk-rating__star-track').forEach((track) => {
        expect(track.text()).toContain('🤍')
      })
      wrapper.findAll('.vrk-rating__star-fill').forEach((fill) => {
        expect(fill.text()).toContain('❤️')
      })
    })

    it('does not emit update:modelValue, change, or hover in disabled mode with slots', async () => {
      const wrapper = mount(Rating, {
        props: { modelValue: 3, disabled: true },
        slots: { filled: '❤️', empty: '🤍' },
      })
      const star = wrapper.findAll('.vrk-rating__star')[0]
      await star.trigger('click')
      await star.trigger('mouseenter')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
      expect(wrapper.emitted('hover')).toBeUndefined()
    })
  })
})
