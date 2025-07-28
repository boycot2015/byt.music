<template>
  <div class="app">
    <div class="flex items-center justify-between">
      <!-- <el-segmented
        v-model="appId"
        :disabled="loading"
        :options="appList"
        size="large"
        :props="{ label: 'name', value: 'id' }"
        @change="
          (val) => {
            setCurrent(val)
            loading = true
          }
        "
      >
        <template #default="{ item }">
          <div class="flex items-center">
            <el-icon v-show="item.icon" class="mr-1"><component :is="item.icon || 'IconApp'" /></el-icon>
            {{ item.name }}
            <el-icon v-show="item.closable" class="ml-1" @click.stop="remove(item.id)"><Delete /></el-icon>
          </div>
        </template>
      </el-segmented> -->
      <el-tabs
        class="w-full"
        type="border-card"
        v-model="appId"
        @tab-click="
          (val) => {
            setCurrent(val.paneName)
            loading = true
          }
        "
        @tab-remove="(id) => remove(id)"
      >
        <el-tab-pane v-for="item in appList" :key="item.id" :name="item.id" :label="item.name" :closable="item.closable">
          <template #label>
            <div class="flex items-center">
              <el-icon v-show="item.icon" class="mr-1"><component :is="item.icon || 'IconApp'" /></el-icon>
              {{ item.name }}
              <!-- <el-icon v-show="item.closable" class="ml-1" @click.stop="remove(item.id)"><Delete /></el-icon> -->
            </div>
          </template>
          <template #default>
            <div class="h-[calc(100vh-220px)] mt-2 rounded overflow-hidden" v-loading="loading">
              <iframe v-if="item.id === appId && !item.affix" :src="item.url" frameborder="0" width="100%" height="100%" @load="loading = false"></iframe>
              <el-row :gutter="16">
                <el-col v-for="item in apps" :key="item.id" :span="24" :sm="12" :md="8" :lg="6" :xl="4">
                  <el-card
                    class="mb-2 cursor-pointer"
                    @click="
                      () => {
                        add(item)
                        setCurrent(item.id)
                      }
                    "
                  >
                    <template #default>
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <el-icon :size="28" v-show="item.icon" class="mr-2"><component :is="item.icon || 'IconApp'" /></el-icon>
                          <span class="line-clamp-1">{{ item.name }}</span>
                        </div>
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
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <addDialog v-model="addVisible" @submit="(item) => add(item, 'apps')"></addDialog>
  </div>
</template>
<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAppStore } from '@/stores/app'
import addDialog from './add.vue'
const appStore = useAppStore()
const { add, remove, setCurrent } = appStore
const apps = computed(() => appStore.apps.filter((item) => !item.affix))
const appList = computed(() => appStore.tabs)
const loading = ref(true)
const addVisible = ref(false)
const appId = ref(appStore.current)
watchEffect(() => {
  appId.value = appStore.current
  loading.value = appList.value.find((el) => el.id == appId.value)?.affix ? false : true
})
</script>
