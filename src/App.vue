<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from './index'

const basic = ref(3)
const precision = ref(2.5)
const rtlBasic = ref(3)
const rtlPrecision = ref(2.5)
const disabled = ref(2.5)
const readonly = ref(4.5)
const tenStars = ref(7.5)
const rtlTenStars = ref(7.5)

const hearts = ref(3.5)
const emoji = ref(2.5)
const svgRating = ref(2.5)

function handleChange(label: string, value: number) {
  console.log(`${label}:`, value)
}
</script>

<template>
  <div style="padding: 2rem; display: grid; gap: 2rem;">
    <!-- LTR Basic -->
    <section>
      <h2>LTR - Basic</h2>
      <p>Value: {{ basic }}</p>

      <VRating
        v-model="basic"
        @change="value => handleChange('LTR Basic', value)"
      />
    </section>

    <!-- LTR Precision -->
    <section>
      <h2>LTR - Precision (step = 0.25)</h2>
      <p>Value: {{ precision }}</p>

      <VRating
        v-model="precision"
        :step="0.25"
        @change="value => handleChange('LTR Precision', value)"
      />
    </section>

    <!-- RTL Basic -->
    <section dir="rtl">
      <h2>RTL - Basic</h2>
      <p>Value: {{ rtlBasic }}</p>

      <VRating
        v-model="rtlBasic"
        @change="value => handleChange('RTL Basic', value)"
      />
    </section>

    <!-- RTL Precision -->
    <section dir="rtl">
      <h2>RTL - Precision (step = 0.25)</h2>
      <p>Value: {{ rtlPrecision }}</p>

      <VRating
        v-model="rtlPrecision"
        :step="0.25"
        @change="value => handleChange('RTL Precision', value)"
      />
    </section>

    <!-- Disabled -->
    <section>
      <h2>Disabled</h2>
      <p>Value: {{ disabled }}</p>

      <VRating
        v-model="disabled"
        :step="0.5"
        disabled
      />
    </section>

    <!-- Readonly -->
    <section>
      <h2>Readonly</h2>
      <p>Value: {{ readonly }}</p>

      <VRating
        v-model="readonly"
        :step="0.5"
        readonly
      />
    </section>

    <!-- 10 Stars -->
    <section>
      <h2>LTR - 10 Stars</h2>
      <p>Value: {{ tenStars }}</p>

      <VRating
        v-model="tenStars"
        :max="10"
        :step="0.5"
        @change="value => handleChange('LTR 10 Stars', value)"
      />
    </section>

    <!-- RTL 10 Stars -->
    <section dir="rtl">
      <h2>RTL - 10 Stars</h2>
      <p>Value: {{ rtlTenStars }}</p>

      <VRating
        v-model="rtlTenStars"
        :max="10"
        :step="0.5"
        @change="value => handleChange('RTL 10 Stars', value)"
      />
    </section>

    <!-- Custom Heart Icons -->
    <section>
      <h2>Custom Heart Icons</h2>
      <p>Value: {{ hearts }}</p>

      <VRating
        v-model="hearts"
        :step="0.5"
        @change="value => handleChange('Heart Rating', value)"
      >
        <template #filled>
          ❤️
        </template>

        <template #empty>
          🤍
        </template>
      </VRating>
    </section>

    <!-- Custom Emoji Icons -->
    <section>
      <h2>Custom Emoji Icons</h2>
      <p>Value: {{ emoji }}</p>

      <VRating
        v-model="emoji"
        :step="0.5"
        @change="value => handleChange('Emoji Rating', value)"
      >
        <template #filled>
          😍
        </template>

        <template #empty>
          <span style="filter:grayscale(1)">😍</span>
        </template>
      </VRating>
    </section>

    <!-- Custom SVG Icons -->
    <section>
  <h2>Custom SVG Icons</h2>
  <p>Value: {{ svgRating }}</p>

  <VRating
    v-model="svgRating"
    :step="0.5"
    @change="value => handleChange('SVG Rating', value)"
  >
    <template #filled>
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        style="display:inline-block;vertical-align:middle;"
      >
        <path
          fill="currentColor"
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
        />
      </svg>
    </template>

    <template #empty>
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        style="display:inline-block;vertical-align:middle;"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
        />
      </svg>
    </template>
  </VRating>
</section>
  </div>
</template>