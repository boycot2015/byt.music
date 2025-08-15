<template>
  <div class="comment pl-2">
    <el-tabs v-model="ctype" @tab-click="() => scrollbarRef.setScrollTop(0)">
      <el-tab-pane :label="item.name" :name="item.type" v-for="item in commentList" :key="item.type"> </el-tab-pane>
    </el-tabs>
    <el-scrollbar ref="scrollbarRef" height="calc(100vh - 110px)" class="pr-3" @end-reached="() => getComments({ page: commentList[1].page, limit: commentList[1].limit })">
      <div v-for="item in commentList" :key="item.type">
        <div v-if="!loading || item.comments?.length" class="py-3" v-show="ctype == item.type">
          <div v-for="commit in item.comments" :key="commit.id">
            <CommentTree :comment="commit" />
          </div>
        </div>
      </div>
      <div class="loading flex py-2 justify-center items-center w-full" v-show="loading">
        <el-button loading link loading-icon="Loading"></el-button>
        <span class="ml-2">加载中...</span>
      </div>
      <Empty v-show="!commentList[0]?.comments?.length && !loading" />
    </el-scrollbar>
    <el-backtop target=".comment .el-scrollbar__wrap" :bottom="80" :right="15">
      <el-icon><Top /></el-icon>
    </el-backtop>
  </div>
</template>

<script name="Comment" lang="js" setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
const playerStore = usePlayerStore()
const { proxy } = getCurrentInstance()
const playData = computed(() => playerStore.playData)
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
const getComments = (params = { limit: 20 }) => {
  if (params.page && ctype.value == 'hot') {
    loading.value = false
    return
  }
  if (params.page) {
    params.page += 1
    commentList.value[1].page = params.page
  }
  loading.value = true
  fetch(`${$musicApiUrl}/comment/music?id=${playData.value.id?.split('_')[1]}&limit=${params.limit}&offset=${params.page ? (params.page - 1) * params.limit : 0}`)
    .then((res) => res.json())
    .then((data) => {
        loading.value = false
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
    })
}
getComments()
</script>

<style scoped>
</style>