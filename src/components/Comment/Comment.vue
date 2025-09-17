<template>
  <div class="comment pl-2 relative">
    <el-tabs
      v-model="ctype"
      @tab-click="
        (val) => {
          ctype = val.paneName
          scrollbarRef.setScrollTop(0)
        }
      "
      class="!sticky border-b border-solid border-[var(--el-border-color)]"
    >
      <el-tab-pane :label="item.label" :name="item.type" v-for="item in commentList" :key="item.type"> </el-tab-pane>
    </el-tabs>
    <el-scrollbar ref="scrollbarRef" :height="type == 'music' ? 'calc(100vh - 106px)' : '100%'" class="pr-3" @end-reached="onReached">
      <div v-for="item in commentList" :key="item.type">
        <div v-if="!loading || item.comments?.length" class="py-3" v-show="ctype == item.type">
          <div v-for="commit in item.comments" :key="commit.id">
            <CommentTree :comment="commit" />
          </div>
        </div>
        <PageLoading class="" v-show="item.more && loading" text="加载中..." />
        <Empty class="w-full" v-show="!item.comments?.length && !loading && ctype == item.type" />
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
import { useVideoStore } from '@/stores/video'
import { filterPlayCount } from '@/utils'
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
const videoStore = useVideoStore()
const { proxy } = getCurrentInstance()
const playDataStore = computed(() => playerStore.playData)
const playVideoDataStore = computed(() => videoStore.videoDetail.playData)
let playData = ref(Object.assign({}, props.type == 'music' ? playDataStore.value : playVideoDataStore.value))
const $apiUrl = proxy.$apiUrl
const ctype = ref('new')
const scrollbarRef = ref(null)
const $musicApiUrl = proxy.$musicApiUrl
const commentList = ref([
  {
    type: 'hot',
    name: '最热',
    label: '最热',
    prop: 'hotComments',
    comments: [],
    page: 1,
    limit: 20,
    total: 0,
    more: false,
  },
  {
    type: 'new',
    name: '最新',
    label: '最新',
    prop: 'comments',
    comments: [],
    page: 1,
    limit: 20,
    total: 0,
    more: true,
  },
])
const page = ref(1)
const loading = ref(false)

const setData = (data) => {
  commentList.value.forEach((item) => {
    let temp = {}
    item.total = data.total
    if (data[item.prop] && data[item.prop].length) item.label = item.name + `(${item.prop == 'hotComments' ? filterPlayCount(data[item.prop].length) : filterPlayCount(data.total)})`
    else item.label = item.name
    item.more = data.more
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
                temp[item.parentCommentId] = { ...item, beReplied: [], ...(item.beReplied[0] || {}) }
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
  if (loading.value) return
  if (params.page && ctype.value == 'hot' || !commentList.value[1].more) {
    loading.value = false
    return
  }
  if (params.page) {
    params.page += 1
    commentList.value[1].page = params.page
  }
  loading.value = true
  let type = playData.value.type
  let id = playData.value.id
  if (props.type == 'music') {
    id = playData.value.id?.split('_')[1]
  }
  if (type != 'netease' && props.type == 'music') {
    if (!playData.value.title) {
      loading.value = false
      return
    }
    let res = await fetch(`${$apiUrl}/${props.type}/search?keyword=${playData.value.title}`).then((res) => res.json())
    id = res.data?.result[0].id?.split('_')[1]
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
watch([playDataStore.value, playVideoDataStore.value], () => {  
  if ((playDataStore.value.id != playData.value.id && props.type == 'music') || (playVideoDataStore.value.id != playData.value.id && props.type == 'mv')) {
    ctype.value = 'new'
    playData.value = Object.assign({}, playDataStore.value)
    commentList.value.forEach((item) => {
      item.comments = []
      item.total = 0
      item.more = true
      item.label = item.name
      item.page = 1
    })
    scrollbarRef.value?.setScrollTop(0)
    getComments()
  }
})
const onReached = (val) => {
  if (val !== 'bottom') {
    loading.value = false
    return
  }
  getComments({ page: commentList.value[1].page, limit: commentList.value[1].limit })
}
onMounted(() => {
  getComments()
})
defineExpose({
  fetchComments: () => getComments({ page: commentList.value[1].page, limit: commentList.value[1].limit }),
})
</script>

<style scoped>
</style>