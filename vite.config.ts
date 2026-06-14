import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: [
        'src/index.ts',
        'src/types/**',
        'src/components/Rating.vue',
        'src/components/index.ts',
        'src/composables/**',
        'src/utils/**',
        'src/constants/**',
      ],
      outDir: 'dist/types',
      rollupTypes: false,
      cleanVueFileName: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueRatingKit',
      fileName: (format) => `vue-rating-kit.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'vue-rating-kit[extname]',
      },
    },
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
