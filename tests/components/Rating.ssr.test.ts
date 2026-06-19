import { describe, it, expect } from 'vitest'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { VRating } from '../../src/index'

describe('SSR', () => {
  it('renders without throwing', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 3, max: 5 }) })
    const html = await renderToString(app)
    expect(html).toContain('vrk-rating')
    expect(html).toContain('radiogroup')
  })

  it('renders correct number of stars', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 2, max: 5 }) })
    const html = await renderToString(app)
    const starCount = (html.match(/vrk-rating__star/g) ?? []).length
    // Each star has vrk-rating__star in two elements (star span + fill span class)
    expect(starCount).toBeGreaterThanOrEqual(5)
  })

  it('renders readonly without throwing', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 4, readonly: true }) })
    const html = await renderToString(app)
    expect(html).toContain('vrk-rating__star--readonly')
  })

  it('renders disabled without throwing', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 0, disabled: true }) })
    const html = await renderToString(app)
    expect(html).toContain('aria-disabled')
  })

  it('renders zero value without throwing', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 0, max: 5 }) })
    const html = await renderToString(app)
    expect(html).toContain('vrk-rating')
  })

  it('renders custom max without throwing', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 3, max: 10 }) })
    const html = await renderToString(app)
    expect(html).toContain('vrk-rating')
  })

  it('renders aria-label', async () => {
    const app = createSSRApp({
      render: () => h(VRating, { modelValue: 3, ariaLabel: 'Product rating' }),
    })
    const html = await renderToString(app)
    expect(html).toContain('Product rating')
  })

  it('applies size class for named size', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 3, size: 'lg' }) })
    const html = await renderToString(app)
    expect(html).toContain('vrk-rating--lg')
  })

  it('applies inline style for numeric size', async () => {
    const app = createSSRApp({ render: () => h(VRating, { modelValue: 3, size: 32 }) })
    const html = await renderToString(app)
    expect(html).toContain('--vrk-star-size')
  })

  it('applies color inline style', async () => {
    const app = createSSRApp({
      render: () => h(VRating, { modelValue: 3, color: '#ff0000' }),
    })
    const html = await renderToString(app)
    expect(html).toContain('--vrk-color-filled')
  })
})
