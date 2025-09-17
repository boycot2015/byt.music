<template>
  <div class="flex justify-center items-center w-full mt-2 pb-2">
    <el-button loading link loading-icon="Loading"></el-button>
    <span class="ml-2">{{ text }}</span>
  </div>
</template>
<script setup>
defineProps({
  text: {
    type: String,
    default: '数据加载中...',
  },
})
</script>