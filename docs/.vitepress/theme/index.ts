import DefaultTheme from 'vitepress/theme'
import PlaygroundRating from './components/PlaygroundRating.vue'
import '../../../src/styles/rating.css'
import './playground.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('PlaygroundRating', PlaygroundRating)
  },
}
