<template>
  <div class="comment pl-2 relative">
    <el-tabs v-model="ctype" @tab-click="() => scrollbarRef.setScrollTop(0)" class="!sticky border-b border-solid border-[var(--el-bg-color)]">
      <el-tab-pane :label="item.name" :name="item.type" v-for="item in commentList" :key="item.type"> </el-tab-pane>
    </el-tabs>
    <el-scrollbar ref="scrollbarRef" :height="type == 'music' ? 'calc(100vh - 110px)' : '100%'" class="pr-3" @end-reached="(direction) => direction === 'bottom' && getComments({ page: commentList[1].page, limit: commentList[1].limit })">
      <div v-for="item in commentList" :key="item.type">
        <div v-if="!loading || item.comments?.length" class="py-3" v-show="ctype == item.type">
          <div v-for="commit in item.comments" :key="commit.id">
            <CommentTree :comment="commit" />
          </div>
        </div>
        <Empty class="w-full" v-show="!item.comments?.length && !loading && ctype == item.type" />
      </div>
      <div class="loading flex py-2 justify-center items-center w-full" v-show="loading">
        <el-button loading link loading-icon="Loading"></el-button>
        <span class="ml-2">加载中...</span>
      </div>
    </el-scrollbar>
    <el-backtop target=".comment .el-scrollbar__wrap" v-if="type == 'music'" :bottom="80" :right="15">
      <el-icon><Top /></el-icon>
    </el-backtop>
  </div>
</template>

<script name="Comment" lang="js" setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { usePlayerStore } from '@/stores/player'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    default: () => 'music', // music, mv, video
  },
})
const playerStore = usePlayerStore()
const { proxy } = getCurrentInstance()
const playDataStore = computed(() => playerStore.playData)
const playData = ref(Object.assign({}, playDataStore.value))
const $apiUrl = proxy.$apiUrl
const ctype = ref('hot')
const scrollbarRef = ref(null)
const $musicApiUrl = proxy.$musicApiUrl
const commentList = ref([
  {
    type: 'hot',
    name: '最热',
    prop: 'hotComments',
    comments: [],
    page: 1,
    limit: 20,
    total: 0,
  },
  {
    type: 'new',
    name: '最新',
    prop: 'comments',
    comments: [],
    page: 1,
    limit: 20,
    total: 0,
  },
])
const page = ref(1)
const loading = ref(false)

const setData = (data) => {
  commentList.value.forEach((item) => {
    let temp = {}
    item.total = data.total
    let comments = data[item.prop]?.filter((item) => item.content && item.parentCommentId) || []
    if (item && item.page) {
      item.comments =[...item.comments, ...(data[item.prop]?.filter((item) => item.content && !item.parentCommentId) || [])]
    } else {
      item.comments = data[item.prop]?.filter((item) => item.content && !item.parentCommentId) || []
    }
    comments.map((item) => {
        if (item.beReplied?.length) {
            const { beReplied, ...others  } = item
            if(temp[item.parentCommentId]) {
                temp[item.parentCommentId].beReplied = [...(temp[item.parentCommentId].beReplied || []), others]
            } else {
                temp[item.parentCommentId] = item.beReplied[0]
            }
        } else {
            temp[item.parentCommentId] = item
            temp[item.parentCommentId].beReplied = []
        }
    })
    for (const key in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, key)) {
            item.comments.push(temp[key])
        }
    }
})
}
const getComments = async (params = { limit: 20 }) => {
  if (params.page && ctype.value == 'hot') {
    loading.value = false
    return
  }
  if (params.page) {
    params.page += 1
    commentList.value[1].page = params.page
  }
  loading.value = true
  let type = playData.value.type
  let id = playData.value.id?.split('_')[1]
  if (!id) {
    loading.value = false
    return
  }
  if (type != 'netease' && props.type == 'music') {
    let res = await fetch(`${$apiUrl}/${props.type}/search?keyword=${playData.value.title}`).then((res) => res.json())
    id = res.data?.result[0].id?.split('_')[1]
    // console.log(res, id, type, playData.value, 'prefix')
  }
  if (props.type == 'video') {
    setData(props.data)
    loading.value = false
    return
  }
  if (!id) {
    loading.value = false
    return
  }
  fetch(`${$musicApiUrl}/comment/${props.type}?id=${id||props.data.id}&limit=${params.limit}&offset=${params.page ? (params.page - 1) * params.limit : 0}`)
    .then((res) => res.json())
    .then((data) => {
        loading.value = false
        setData(data)
    })
}
watch(playDataStore.value, () => {
  if (playDataStore.value.id != playData.value.id) {
    ctype.value = 'hot'
    // console.log(playDataStore.value.id, playData.value.id);
    playData.value = Object.assign({}, playDataStore.value)
    commentList.value.forEach((item) => {
      item.comments = []
      item.total = 0
      item.page = 1
    })
    scrollbarRef.value?.setScrollTop(0)
    getComments()
  }
})
onMounted(() => {
  getComments()
})
</script>

<style scoped>
</style>