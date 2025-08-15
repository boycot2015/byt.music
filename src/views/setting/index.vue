<template>
  <div class="setting">
    <el-row>
      <el-col :span="0" :md="4" class="relative">
        <el-scrollbar height="calc(100vh - 140px)" class="border-r border-[var(--el-border-color)]">
          <div class="!hidden md:!block !fixed top-2">
            <el-anchor ref="anchorRef" container=".layout .active .el-scrollbar__wrap" select-scroll-top type="underline" @click="(e, href) => anchorRef?.scrollTo(href)">
              <el-anchor-link v-for="(item, key) in configs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
              <el-anchor-link v-for="(item, key) in playConfigs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
              <el-anchor-link v-for="(item, key) in brConfigs" :href="`#config-${key}`" :key="key"> {{ item.label }} </el-anchor-link>
            </el-anchor>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="24" :md="20">
        <el-form size="large" :model="config" class="config-form md:pr-4 md:pl-4 w-full" label-position="left">
          <el-form-item v-for="(item, key) in configs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
            <el-select popper-class="backdrop-blur" v-if="item.type == 'select'" v-model="config[key]" @change="set({ [key]: config[key] })">
              <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-radio-group v-else-if="item.type == 'radio'" :disabled="item.disabled" v-model="config[key]" @change="set({ [key]: config[key] })">
              <el-radio v-for="item in item.options" :key="item.value" :value="item.value"> {{ item.label }} </el-radio>
            </el-radio-group>
            <component v-else-if="item.component" :is="item.component" />
            <el-input v-else v-model="config[key]" :type="item.type || 'text'" :placeholder="item.placeholder || '请输入'" :maxlength="item.maxlength" />
          </el-form-item>
        </el-form>
        <el-form size="large" :model="player" class="config-player md:pr-4 md:pl-4 w-full" label-position="left">
          <el-form-item v-for="(item, key) in playConfigs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
            <el-select popper-class="backdrop-blur" v-if="item.type == 'select'" v-model="player[key]" @change="set({ [key]: player[key] })">
              <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-radio-group v-else-if="item.type == 'radio'" :disabled="item.disabled" v-model="player[key]" @change="set({ [key]: player[key] })">
              <el-radio v-for="item in item.options" :key="item.value" :value="item.value"> {{ item.label }} </el-radio>
            </el-radio-group>
            <component v-else-if="item.component" :is="item.component" />
            <el-input v-else v-model="player[key]" :type="item.type || 'text'" :placeholder="item.placeholder || '请输入'" :maxlength="item.maxlength" />
          </el-form-item>
        </el-form>
        <el-form size="large" class="config-form md:pr-4 md:pl-4 w-full" label-position="left">
          <el-form-item v-for="(item, key) in brConfigs" :id="'config-' + key" :label="item.label" :prop="key" :key="key" :label-position="item.labelPosition" :class="item.class">
            <component v-if="item.component" :is="item.component" />
          </el-form-item>
        </el-form>
        <!-- <el-scrollbar :height="!config.isMobile ? 'calc(100vh - 140px)' : 'auto'"> </el-scrollbar> -->
      </el-col>
    </el-row>
  </div>
</template>
<script name="setting" setup>
import PlaySource from './components/PlaySource/index.vue'
import Backup from './components/Backup.vue'
import ThemeConfig from './components/ThemeConfig.vue'
import { useConfigStore } from '@/stores/config'
import { usePlayerStore } from '@/stores/player'
import { ref, markRaw, computed, onMounted, onActivated } from 'vue'
const { config, set } = useConfigStore()
const { player, setPlayer } = usePlayerStore()
const anchorRef = ref(null)
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
    options: [
      { label: '黑体', value: 'blackFont' },
      { label: '宋体', value: 'Song' },
      { label: '楷体', value: 'KaiTi' },
      { label: 'OPPO', value: 'OPPOFont' },
      { label: '仓耳', value: 'CangErYuYang' },
    ],
  },
  theme: {
    label: '主题配置',
    labelPosition: 'top',
    class: 'md:pl-0',
    component: markRaw(ThemeConfig),
  },
  showTableAction: {
    label: '是否显示表格操作列',
    type: 'radio',
    options: [
      { label: '关闭', value: false },
      { label: '开启', value: true },
    ],
  },
  showTab: {
    label: '是否显示底部菜单',
    type: 'radio',
    options: [
      { label: '关闭', value: false },
      { label: '开启', value: true },
    ],
  },
  textShadow: {
    label: '是否显示文字阴影',
    type: 'radio',
    options: [
      { label: '关闭', value: false },
      { label: '开启', value: true },
    ],
  },
  showPlyerBar: {
    label: '是否显示播放器',
    type: 'radio',
    options: [
      { label: '关闭', value: false },
      { label: '开启', value: true },
    ],
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
    disabled: computed(() => !!config.isMobile),
    options: [
      { label: 'mini', value: 'small' },
      { label: '中等', value: 'middle' },
      { label: '全宽(移动端默认)', value: 'full' },
    ],
  },
  visualizer: {
    label: '歌词可视化(实验性)',
    type: 'radio',
    options: [
      { label: '关闭', value: false },
      { label: '开启', value: true },
    ],
  },
  lyricAlign: {
    label: '歌词对齐方式',
    type: 'radio',
    labelPosition: 'top',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中对齐', value: 'center' },
      { label: '右对齐', value: 'right' },
    ],
  },
  quality: {
    label: '音质(需播放源支持)',
    type: 'radio',
    options: [
      { label: '128k', value: '128k' },
      { label: '320k', value: '320k' },
      { label: 'flac', value: 'flac' },
    ],
  },
  // Add more configuration options here
})
const brConfigs = ref({
  backup: {
    label: '备份恢复与重置',
    labelPosition: 'top',
    class: 'md:pl-0 !mb-0',
    component: markRaw(Backup),
  },
  // Add more configuration options here
})
onMounted(() => {
  set({ loaded: false })
})
onActivated(() => {
  set({ loaded: true })
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
