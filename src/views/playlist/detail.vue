<template>
  <div class="playlist-detail">
    <h1>This is an playlist-detail page</h1>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
console.log(route.params)
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 50vh;
    display: flex;
    align-items: center;
  }
}
</style>
