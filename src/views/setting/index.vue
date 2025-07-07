<template>
  <div class="setting">
    <h1>This is an setting page {{ config.title }}</h1>
  </div>
</template>
<script setup>
import { useConfigStore } from '@/stores/config'
const { config } = useConfigStore()
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
