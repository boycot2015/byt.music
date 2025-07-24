<template>
  <div class="setting">
    <el-row>
      <el-col :span="0" :md="4" class="!hidden md:!block">
        <el-scrollbar height="calc(100vh - 160px)" class="border-r border-[var(--el-border-color)]">
          <div class="flex h-full">
            <el-anchor select-scroll-top type="underline" :offset="0" container=".config-form">
              <el-anchor-link v-for="(item, key) in configs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
            </el-anchor>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="24" :md="20">
        <el-scrollbar height="calc(100vh - 160px)" class="">
          <el-form :model="config" ref="formRef" class="config-form pr-4 w-full" label-width="90px" label-position="right">
            <el-form-item v-for="(item, key) in configs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
              <el-select v-if="item.type == 'select'" v-model="config[key]" @change="set({ [key]: config[key] })">
                <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <component v-else-if="item.component" :is="item.component" />
              <el-input v-else v-model="config[key]" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script name="setting" setup>
import PlaySource from './components/PlaySource/index.vue'
import ThemeConfig from './components/ThemeConfig.vue'
import { useConfigStore } from '@/stores/config'
import { ref, markRaw } from 'vue'
const { config, set } = useConfigStore()
const configs = ref({
  title: {
    label: '标题',
  },
  description: {
    label: '描述',
  },
  family: {
    label: '字体',
    type: 'select',
    options: config.familys,
  },
  theme: {
    label: '主题配置',
    labelPosition: 'top',
    class: 'pl-4',
    component: markRaw(ThemeConfig),
  },
  playSource: {
    label: '播放源',
    labelPosition: 'top',
    class: 'pl-4',
    component: markRaw(PlaySource),
  },
  // Add more configuration options here
})
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
