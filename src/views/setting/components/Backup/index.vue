<template>
  <div class="w-full play-source flex flex-col md:flex-row md:items-center">
    <el-button type="primary" class="mt-2 w-full md:w-[auto] md:mt-0" @click="visible = true"
      ><el-icon class="mr-2"><Plus /></el-icon>导入</el-button
    >
    <el-button type="primary" class="mt-2 !ml-0 md:!ml-4 w-full md:w-[auto] md:mt-0" @click="onExport()"
      ><el-icon class="mr-2"><Upload /></el-icon>导出</el-button
    >
    <el-button type="danger" class="mt-2 !ml-0 md:!ml-4 w-full md:w-[auto] md:mt-0" @click="onReset()"
      ><el-icon class="mr-2"><RefreshLeft /></el-icon>恢复默认设置</el-button
    >
    <el-dialog title="导入配置" modal-class="backdrop-blur" :z-index="100001" :close-on-click-modal="false" width="360px" v-model="visible" @close="visible = false" top="30vh" center>
      <div class="tip leading-[20px] my-2">导入配置后，部分配置可能需要刷新才能生效。</div>
      <template #footer>
        <div class="flex flex-row justify-center">
          <el-upload :show-file-list="false" accept=".json" :disabled="!!playSource" :auto-upload="false" :on-change="importSource">
            <el-button type="primary" :disabled="!!playSource" :loading="importLoading">本地导入</el-button>
          </el-upload>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePlayerStore } from '@/stores/player'
import { useConfigStore } from '@/stores/config'
import { useCollectStore } from '@/stores/collect'
const { defaults: playerDefaults, player, source, playData, setSource, setPlayer, setPlayData } = usePlayerStore()
const { defaults, config, set } = useConfigStore()
const { update: updateCollect } = useCollectStore()
const { proxy } = getCurrentInstance()
const $apiUrl = proxy.$apiUrl
const visible = ref(false)
const playSource = ref('')
const importLoading = ref(false)
const list = computed(() => source.list)
const importSource = async (file) => {
  if (file.raw.type !== 'application/json') {
    ElMessage.error('仅支持导入json格式的文件!')
    return false
  } else if (file.raw.size / 1024 / 1024 > 100) {
    ElMessage.error('文件大小不能超过 100MB!')
    return false
  }
  let reader = new FileReader() //先new 一个读文件的对象 FileReader
  if (typeof FileReader === 'undefined') {
    //用来判断你的浏览器是否支持 FileReader
    ElMessage({
      type: 'info',
      message: '您的浏览器不支持文件读取。',
    })
    return
  }
  reader.readAsArrayBuffer(file.raw) //读任意文件
  reader.onload = function (e) {
    var ints = new Uint8Array(e.target.result) //要使用读取的内容，所以将读取内容转化成Uint8Array
    ints = ints.slice(0, 5000) //截取一段读取的内容
    let data = new TextDecoder('utf-8').decode(ints) //二进制缓存区内容转化成中文（即也就是读取到的内容）
    try {
      data = JSON.parse(data)
    } catch (error) {
      data = {}
    }
    visible.value = false
    set({ ...data.config })
    setSource({ ...data.source })
    setPlayer({ ...data.player })
    setPlayData({ ...data.playData })
    // console.log('导入成功:', data)
    // console.log(rawFile, data, 'rawFile');
  }
  // const formData = new FormData()
  // formData.append('file', val.raw)
  // // 使用Fetch API发送文件
  // console.log(val.raw, 'val.raw')

  // fetch(`${$apiUrl}/music/import/source`, {
  //   method: 'POST',
  //   body: formData,
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log('导入成功:', data)
  //   })
  //   .catch((error) => {
  //     console.error('上传过程中出现错误:', error)
  //   })
}
const onReset = () => {
  ElMessageBox.confirm('您确定要恢复默认设置吗？这将重置当前所有配置。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    modalClass: 'backdrop-blur',
    type: 'warning',
  })
    .then(() => {
      set({ ...defaults })
      setSource({ ...playerDefaults.source })
      setPlayer({ ...playerDefaults.player })
      setPlayData({ ...playerDefaults.playData })
      updateCollect([])
    })
    .catch(() => {})
}
const onExport = () => {
  const data = {
    config,
    source,
    player,
    playData,
  }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'byt-music-config.json'
  document.body.appendChild(a)
  a.click()
}
</script>

<style>
</style>