<script setup lang="ts">
import { ref } from 'vue'
import { VRating } from './index'

const rating = ref(3)
</script>

<template>
  <div style="padding: 2rem">
    <h1>vue-rating-kit Playground</h1>

    <VRating
      v-model="rating"
      aria-label="Product rating"
      
    />

    <p>Current rating: {{ rating }}</p>
  </div>
</template>