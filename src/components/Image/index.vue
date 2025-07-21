<template>
  <el-image v-bind="$attrs">
    <template #error>
      <slot name="error">
        <el-icon>
          <icon-music />
        </el-icon>
      </slot>
    </template>
    <template #placeholder>
      <slot name="placeholder">
        <div class="flex items-center justify-center h-full">
          <el-icon :size="100">
            <icon-music />
          </el-icon>
        </div>
      </slot>
    </template>
  </el-image>
</template>
<script setup lang="ts">
import { ElImage } from 'element-plus'
</script>
