import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/vue-rating-kit/',
  title: 'Vue Rating Kit',
  description: 'Lightweight, accessible, TypeScript-first star rating component for Vue 3',

  vite: {
    resolve: {
      alias: {
        'vue-rating-kit': path.resolve(__dirname, '../../src/index.ts'),
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
      },
      {
        text: 'Guide',
        items: [
          { text: 'Examples', link: '/guide/examples' },
          { text: 'Customization', link: '/guide/customization' },
          { text: 'Playground', link: '/guide/playground' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'API Reference', link: '/api/' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sakmbd/vue-rating-kit' },
    ],

    footer: {
      message: 'Released under the MIT License.',
    },
  },
})
