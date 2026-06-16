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
  </div>
</template>
