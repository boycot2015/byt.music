<template>
  <div class="app overflow-hidden">
    <div class="flex flex-col">
      <el-tabs size="small" class="w-full tabs" type="card" addable v-model="appId" @tab-click="onTabClick" @tab-remove="(id) => remove(id)">
        <template #add-icon>
          <el-dropdown trigger="click" @command="onAction">
            <el-icon :size="20" class="el-icon--right pr-1">
              <arrow-down />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :disabled="tabs.length <= 1 || current.affix" command="closeCurrent">关闭当前</el-dropdown-item>
                <el-dropdown-item :disabled="tabs.length <= 1" command="closeOther">关闭其他</el-dropdown-item>
                <el-dropdown-item :disabled="tabs.length <= 1" command="closeAll">关闭全部</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <el-tab-pane v-for="item in tabs" :key="item.id" :name="item.id" :label="item.name" :closable="!!item.closable">
          <template #label>
            <div class="flex items-center">
              <Image :src="item.icon" alt="" class="w-[20px] h-[20px] mr-1" v-if="item.icon && item.icon.includes('http')"></Image>
              <el-icon v-else-if="item.icon" class="mr-1"><component :is="item.icon || 'IconApp'" /></el-icon>
              {{ item.name }}
            </div>
          </template>
          <div class="h-[calc(100vh-185px)] rounded overflow-hidden" v-loading="loading">
            <el-scrollbar class="py-3" v-show="current.affix">
              <div class="overflow-hidden">
                <div class="flex items-center justify-between mb-2">
                  <h3>热门推荐</h3>
                  <el-link underline="never" type="primary" size="small" @click="isEdit = !isEdit"
                    ><el-icon :size="16" class="mr-1" v-if="isEdit"><Edit /></el-icon><el-icon :size="16" class="mr-1" v-else><Setting /></el-icon> {{ !isEdit ? '管理' : '退出' }}</el-link
                  >
                </div>
                <el-row :gutter="16" class="apps">
                  <el-col v-for="item in apps" :key="item.id" :span="12" :sm="8" :md="6" :lg="4" :xl="3">
                    <el-card
                      class="mb-4 cursor-pointer !border-0"
                      body-class="!p-3"
                      shadow="hover"
                      @click="
                        () => {
                          if (isEdit && item.editable) {
                            addVisible = true
                            rowData = item
                            return
                          }
                          NProgress.start()
                          loading = !has(item.id)
                          !loading && NProgress.done()
                          add(item)
                          setCurrent(item.id)
                        }
                      "
                    >
                      <template #default>
                        <div class="flex items-center justify-between relative">
                          <div class="flex items-center">
                            <Image v-if="item.icon && item.icon.includes('http')" :src="item.icon" alt="" class="w-[24px] h-[24px] mr-2"></Image>
                            <el-icon :size="36" v-else-if="item.icon" class="mr-3"><component :is="item.icon || 'IconApp'" /></el-icon>
                            <div class="flex flex-col">
                              <span class="line-clamp-1">{{ item.name }}</span>
                              <span class="line-clamp-1 text-sm text-[var(--vt-c-secondary)]">{{ item.desc || item.name }}</span>
                            </div>
                          </div>
                          <div class="flex flex-col md:flex-row items-center md:justify-end">
                            <el-icon
                              :size="20"
                              class="!text-[var(--el-color-primary)]"
                              v-show="isEdit && item.editable"
                              @click.stop="
                                () => {
                                  addVisible = true
                                  rowData = item
                                }
                              "
                              ><Edit
                            /></el-icon>
                            <el-icon :size="20" class="!text-[var(--el-color-primary)] mt-1 md:mt-0 md:ml-2" v-show="item.closable && isEdit" @click.stop="remove(item.id, 'apps')"><Close /></el-icon>
                          </div>
                        </div>
                      </template>
                    </el-card>
                  </el-col>
                  <el-col :span="12" :sm="8" :md="6" :lg="4" :xl="3" class="app-add">
                    <el-card
                      class="mb-2 cursor-pointer !border-0"
                      shadow="hover"
                      @click="
                        () => {
                          addVisible = true
                          rowData = {}
                        }
                      "
                    >
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
    <addDialog v-model="addVisible" :rowData="rowData" @submit="(item) => (item.id ? update(item, 'apps') : add(item, 'apps'))"></addDialog>
  </div>
</template>
<script name="app" setup>
import { ref, computed, watchEffect, watch, onActivated, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import addDialog from './add.vue'
import Sortable from 'sortablejs' //插件引入
import NProgress from 'nprogress'

const appStore = useAppStore()
// const router = useRouter()
const { add, remove, has, update, set, setCurrent } = appStore
const apps = computed(() => appStore.apps.filter((item) => !item.affix))
const tabs = computed(() => appStore.tabs)
const addVisible = ref(false)
const appId = ref(appStore.current)
const isEdit = ref(false)
const loading = ref(true)
const rowData = ref({})
let appsortable = null
const current = computed(() => appStore.tabs.find((item) => item.id === appStore.current))
watchEffect(() => {
  appId.value = appStore.current
})
onActivated(() => {
  loading.value = false
})
onMounted(() => {
  Sortable.create(document.querySelector('.tabs .el-tabs__nav'), {
    animation: 300,
    easing: 'ease-in-out',
    draggable: '.el-tabs__item.is-closable',
    onEnd: (evt) => {
      let list = tabs.value
      const movedItem = tabs.value[evt.oldIndex]
      list.splice(evt.oldIndex, 1)
      list.splice(evt.newIndex, 0, movedItem)
      set(list, 'tabs')
    },
  })
  appsortable = Sortable.create(document.querySelector('.el-row.apps'), {
    animation: 150,
    draggable: '.el-col',
    filter: '.el-col.app-add',
    easing: 'cubic-bezier(1, 0, 0, 1)',
    disabled: true,
    onEnd: (evt) => {
      let list = apps.value
      const movedItem = apps.value[evt.oldIndex]
      list.splice(evt.oldIndex, 1)
      list.splice(evt.newIndex, 0, movedItem)
      set(
        list.filter((item) => item),
        'apps'
      )
    },
  })
})
const onAction = (command) => {
  switch (command) {
    case 'closeCurrent':
      !current.value.affix && remove(appId.value, 'tabs')
      break
    case 'closeOther':
      set(appStore.apps.filter((item) => item.affix).concat(tabs.value.filter((item) => item.id === appId.value && !item.affix)), 'tabs')
      break
    case 'closeAll':
      set(
        appStore.apps.filter((item) => item.affix),
        'tabs'
      )
      break
  }
}
const onTabClick = (val) => {
  if (val.paneName == appId.value) {
    return
  }
  setCurrent(val.paneName)
  loading.value = false
}
watch(isEdit, (val) => {
  appsortable?.option('disabled', !val)
})
watch(loading, (val) => {
  if (!val) {
    NProgress.done()
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-tabs.el-tabs--border-card > .el-tabs__content) {
  padding: 0px !important;
  border: 0 !important;
}
:deep(.el-tabs__item.is-closable) {
  background-color: var(--el-color-bg);
}
:deep(.el-tabs__new-tab) {
  border: 0 !important;
}
</style>
