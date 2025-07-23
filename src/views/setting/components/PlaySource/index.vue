<template>
  <div class="play-source flex items-center">
    <el-radio-group v-model="source.apiUrl" @change="() => setSource(list.find((el) => el.apiUrl == source.apiUrl) || {}, '切换成功')">
      <el-radio v-for="(radio, index) in list" :key="index" border :value="radio.apiUrl" :disabled="!radio.apiUrl"
        ><span class="flex items-center"
          >{{ radio.name }} <el-icon v-if="radio.id" class="ml-2" @click="removeSource(radio.id)"><Delete /></el-icon></span
      ></el-radio>
    </el-radio-group>
    <el-button type="primary" class="ml-8" @click="visible = true"
      ><el-icon class="mr-2"><Plus /></el-icon>导入</el-button
    >
    <el-dialog title="导入自定义源" :close-on-click-modal="false" width="480px" v-model="visible" @close="visible = false" top="30vh" center>
      <el-input clearable v-model="playSource" placeholder="请输入自定义源，格式：https://xxx.js"> </el-input>
      <div class="tip leading-[20px] mt-5">提示：虽然我们已经尽可能地隔离了脚本的运行环境，但导入包含恶意行为的脚本仍可能会影响你的系统，请谨慎导入。</div>
      <template #footer>
        <div class="flex flex-row justify-center">
          <el-button type="primary" :disabled="!playSource" @click="importSource()" :loading="importLoading">在线导入</el-button>
          <el-upload :show-file-list="false" accept=".js" :disabled="!!playSource" :auto-upload="false" :on-change="importSource">
            <el-button type="primary" class="ml-8" :disabled="!!playSource" :loading="importLoading">本地导入</el-button>
          </el-upload>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useConfigStore } from '@/stores/config'
const { source, setSource, removeSource } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const visible = ref(false)
const playSource = ref('')
const importLoading = ref(false)
const list = computed(() => source.list)
const importSource = async (val) => {
  if (playSource.value) {
    if (!/^https?:\/\//.test(playSource.value) || !/[.js]$/.test(playSource.value)) {
      ElMessage.error('请输入正确的格式')
      return
    }
    let url = playSource.value
    if (!url) return
    importLoading.value = true
    let res = ''
    try {
      res = await fetch(`${$apiUrl}/music/import/source?url=${url}`, { method: 'POST', follow_max: 3 }).then((resp) => resp.json())
      setSource(
        {
          ...source,
          list: [...source.list, res.data],
        },
        '导入成功'
      )
      visible.value = false
    } catch (err) {
      ElMessage.error(err.message || '导入失败')
      return
    } finally {
      importLoading.value = false
      visible.value = false
    }
    return
  }
  console.log(val)
  const formData = new FormData()
  formData.append('file', val.raw)
  // 使用Fetch API发送文件
  fetch(`${$apiUrl}/music/import/source`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      ElMessage.success('导入成功')
      console.log('导入成功:', data)
      setSource(
        {
          ...source,
          list: [...source.list, data.data],
        },
        '导入成功'
      )
    })
    .catch((error) => {
      console.error('上传过程中出现错误:', error)
    })
  // set({
  //   playSource: {
  //     list: [...config.playSource.list, {
  //       title: val.name,
  //       url: val.name,
  //     }],
  //     url: playSource.value,
  //   }
  // })
  visible.value = false
}
</script>

<style>
</style>