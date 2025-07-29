<template>
  <div class="app">
    <div class="flex flex-col">
      <el-tabs
        class="w-full"
        type="border-card"
        v-model="appId"
        @tab-click="
          (val) => {
            setCurrent(val.paneName)
            loading = false
          }
        "
        @tab-remove="(id) => remove(id)"
      >
        <el-tab-pane v-for="item in appList" :key="item.id" :name="item.id" :label="item.name" :closable="item.closable">
          <template #label>
            <div class="flex items-center">
              <Image :src="item.icon" alt="" width="28px" height="28px" v-if="item.icon && item.icon.includes('http')" class="mr-1"></Image>
              <el-icon v-else-if="item.icon" class="mr-1"><component :is="item.icon || 'IconApp'" /></el-icon>
              {{ item.name }}
            </div>
          </template>
          <div class="h-[calc(100vh-185px)] rounded" v-loading="loading">
            <el-scrollbar class="p-3" v-show="current.affix">
              <div class="overflow-hidden">
                <div class="flex items-center justify-between mb-2">
                  <h3>热门推荐</h3>
                  <el-link underline="never" type="primary" size="small" @click="isEdit = !isEdit"
                    ><el-icon :size="16" class="mr-1" v-if="isEdit"><Edit /></el-icon><el-icon :size="16" class="mr-1" v-else><Setting /></el-icon> {{ !isEdit ? '管理' : '退出' }}</el-link
                  >
                </div>
                <el-row :gutter="16">
                  <el-col v-for="item in apps" :key="item.id" :span="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-card
                      class="mb-4 cursor-pointer"
                      @click="
                        () => {
                          loading = !has(item.id)
                          add(item)
                          setCurrent(item.id)
                        }
                      "
                    >
                      <template #default>
                        <div class="flex items-center justify-between relative">
                          <div class="flex items-center">
                            <Image v-if="item.icon && item.icon.includes('http')" :src="item.icon" alt="" width="28px" height="28px" class="mr-1"></Image>
                            <el-icon :size="28" v-else-if="item.icon" class="mr-2"><component :is="item.icon || 'IconApp'" /></el-icon>
                            <span class="line-clamp-1">{{ item.name }}</span>
                          </div>
                          <el-icon :size="20" class="!text-[var(--el-color-primary)]" v-show="item.closable && isEdit" @click.stop="remove(item.id, 'apps')"><Close /></el-icon>
                        </div>
                      </template>
                    </el-card>
                  </el-col>
                  <el-col :span="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-card class="mb-2 cursor-pointer" @click="addVisible = true">
                      <template #default>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <el-icon :size="28" class="mr-2"><Plus /></el-icon>
                            <span class="line-clamp-1">添加应用</span>
                          </div>
                        </div>
                      </template>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
            <iframe v-show="item.id === appId && !item.affix" :src="item.url" frameborder="0" width="100%" height="100%" @load="loading = false"></iframe>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <addDialog v-model="addVisible" @submit="(item) => add(item, 'apps')"></addDialog>
  </div>
</template>
<script name="app" setup>
import { ref, computed, watchEffect, onActivated } from 'vue'
// import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import addDialog from './add.vue'
const appStore = useAppStore()
// const router = useRouter()
const { add, remove, has, setCurrent } = appStore
const apps = computed(() => appStore.apps.filter((item) => !item.affix))
const appList = computed(() => appStore.tabs)
const addVisible = ref(false)
const appId = ref(appStore.current)
const isEdit = ref(false)
const loading = ref(true)
const current = computed(() => appStore.tabs.find((item) => item.id === appStore.current))
watchEffect(() => {
  appId.value = appStore.current
})
onActivated(() => {
  loading.value = current.value?.affix ? false : true
})
</script>
<style lang="scss" scoped>
:deep(.el-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0px !important;
  border: 0 !important;
}
</style>
