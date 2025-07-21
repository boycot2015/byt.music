<template>
  <div class="play-source flex items-center">
    <el-radio-group v-model="config.playSource.url" disabled>
      <el-radio v-for="(radio, index) in list" :key="index" border :value="radio.url">{{ radio.title }}</el-radio>
    </el-radio-group>
    <el-button type="primary" class="ml-8" @click="visible = true"
      ><el-icon><Plus /></el-icon>导入</el-button
    >
    <el-dialog title="导入自定义源" :close-on-click-modal="false" width="480px" v-model="visible" @close="visible = false" top="30vh" center>
      <el-input clearable v-model="playSource" placeholder="请输入自定义源，格式：https://xxx.json"> </el-input>
      <div class="tip leading-[20px] mt-5">提示：虽然我们已经尽可能地隔离了脚本的运行环境，但导入包含恶意行为的脚本仍可能会影响你的系统，请谨慎导入。</div>
      <template #footer>
        <div class="flex flex-row justify-center">
          <el-button type="primary" :disabled="!playSource" @click="importSource()">在线导入</el-button>
          <el-upload :show-file-list="false" accept=".js" :disabled="!!playSource" :auto-upload="false" :on-change="importSource">
            <el-button type="primary" class="ml-8" :disabled="!!playSource">本地导入</el-button>
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
const { config, set } = useConfigStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const visible = ref(false)
const playSource = ref('')
const list = computed(() => config.playSource.list)
const handleGetMusicUrl = async (source, musicInfo, quality) => {
  const DEV_ENABLE = false
  const API_URL = 'https://lxmusicapi.onrender.com'
  const API_KEY = 'share-v2'
  const songId = musicInfo.hash ?? musicInfo.songmid
  const version = '2.11.0'
  const env = DEV_ENABLE ? 'dev' : 'prod'
  const request = await fetch(`${$apiUrl}/apiDocs?url=${API_URL}/url/${source}/${songId}/${quality}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': env ? `lx-music-${env}/${version}` : `lx-usic-request/${version}`,
      'X-Request-Key': API_KEY,
    },
  })
  const { body } = request
  if (!body || isNaN(Number(body.code))) throw new Error('unknow error')
  switch (body.code) {
  case 0:
    return body.url
  case 1:
    throw new Error('block ip')
  case 2:
    throw new Error('get music url failed')
  case 4:
    throw new Error('internal server error')
  case 5:
    throw new Error('too many requests')
  case 6:
    throw new Error('param error')
  default:
    throw new Error(body.msg ?? 'unknow error')
  }
}
const importSource = (val) => {
  if (playSource.value) {
    if (!/^https?:\/\//.test(playSource.value) || !/[.js]$/.test(playSource.value)) {
      ElMessage.error('请输入正确的格式')
      return
    }
    fetch(`${playSource.value}`).then((data) => {
      console.log(eval(data.body))
      handleGetMusicUrl('qq', {songmid: '0036v2971854iJ' }, 128).then((url) => {
        console.log(url)
      })
      ElMessage.success('导入成功')
      // set({
      //   playSource: {
      //     ...config.playSource,
      //     url: playSource.value,
      //   }
      // })
      visible.value = false
    })
    return
  }
  console.log(val)
  ElMessage.success('导入成功')
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