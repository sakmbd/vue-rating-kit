<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from 'vue-rating-kit'
import 'vue-rating-kit/style.css'

const rating = ref(2)

function handleChange(value: number) {
  console.log('change:', value)
}

function handleHover(value: number) {
  console.log('hover:', value)
}
</script>

<template>
  <div>
    <h2>Rating: {{ rating }}</h2>

    <VRating
      v-model="rating"
      :step="0.5"
      @change="handleChange"
      @hover="handleHover"
    />
  </div>
</template>