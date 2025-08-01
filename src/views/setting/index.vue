<template>
  <div class="setting">
    <el-row>
      <el-col :span="0" :md="4" class="!hidden md:!block">
        <el-scrollbar height="calc(100vh - 140px)" class="border-r border-[var(--el-border-color)]">
          <div class="flex h-full">
            <el-anchor select-scroll-top type="underline" :offset="0" container=".config-form">
              <el-anchor-link v-for="(item, key) in configs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
              <el-anchor-link v-for="(item, key) in playConfigs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
              <el-anchor-link v-for="(item, key) in brConfigs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
            </el-anchor>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="24" :md="20">
        <el-scrollbar height="calc(100vh - 140px)" class="">
          <el-form :model="config" class="config-form md:pr-4 md:pl-4 w-full" label-position="left">
            <el-form-item v-for="(item, key) in configs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
              <el-select popper-class="backdrop-blur" v-if="item.type == 'select'" v-model="config[key]" @change="set({ [key]: config[key] })">
                <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <component v-else-if="item.component" :is="item.component" />
              <el-input v-else v-model="config[key]" :type="item.type || 'text'" :placeholder="item.placeholder || '请输入'" :maxlength="item.maxlength" />
            </el-form-item>
          </el-form>
          <el-form :model="player" class="config-player md:pr-4 md:pl-4 w-full" label-position="left">
            <el-form-item v-for="(item, key) in playConfigs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
              <el-select popper-class="backdrop-blur" v-if="item.type == 'select'" v-model="player[key]" @change="set({ [key]: player[key] })">
                <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <el-radio-group v-else-if="item.type == 'radio'" v-model="player[key]" @change="set({ [key]: player[key] })">
                <el-radio v-for="item in item.options" :key="item.value" :value="item.value"> {{ item.label }} </el-radio>
              </el-radio-group>
              <component v-else-if="item.component" :is="item.component" />
              <el-input v-else v-model="player[key]" :type="item.type || 'text'" :placeholder="item.placeholder || '请输入'" :maxlength="item.maxlength" />
            </el-form-item>
          </el-form>
          <el-form class="config-form md:pr-4 md:pl-4 w-full" label-position="left">
            <el-form-item v-for="(item, key) in brConfigs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
              <component v-if="item.component" :is="item.component" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script name="setting" setup>
import PlaySource from './components/PlaySource/index.vue'
import Backup from './components/Backup/index.vue'
import ThemeConfig from './components/ThemeConfig.vue'
import { useConfigStore } from '@/stores/config'
import { usePlayerStore } from '@/stores/player'
import { ref, markRaw, computed } from 'vue'
const { config, set } = useConfigStore()
const { player, setPlayer } = usePlayerStore()
const configs = ref({
  title: {
    label: '标题',
    maxlength: 15,
  },
  description: {
    label: '描述',
    type: 'textarea',
    maxlength: 150,
  },
  family: {
    label: '字体',
    type: 'select',
    options: config.familys,
  },
  theme: {
    label: '主题配置',
    labelPosition: 'top',
    class: 'md:pl-0',
    component: markRaw(ThemeConfig),
  },
  // Add more configuration options here
})
const playConfigs = ref({
  playSource: {
    label: '播放源',
    labelPosition: 'top',
    class: 'md:pl-0',
    component: markRaw(PlaySource),
  },
  playBar: {
    label: '播放进度条样式',
    labelPosition: 'top',
    class: 'md:pl-0',
    type: 'radio',
    options: player.playBars,
  },
  // Add more configuration options here
})
const brConfigs = ref({
  backup: {
    label: '备份恢复与重置',
    labelPosition: 'top',
    class: 'md:pl-0',
    component: markRaw(Backup),
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
