<template>
  <div class="comment-tree my-2">
    <div class="flex mb-2 justify-between">
      <div class="flex-1 flex">
        <el-avatar class="avatar" :size="32" :src="comment.user?.avatarUrl">
          <template #error>
            <el-icon><User /></el-icon>
          </template>
        </el-avatar>
        <div class="info flex flex-col ml-2">
          <div class="name text-sm">{{ comment.user?.nickname }}</div>
          <div class="time text-xs text-[var(--el-text-color-regular)]">{{ comment.timeStr || new Date(comment.time || Date.now()).toLocaleString() }}</div>
        </div>
      </div>
      <div class="like-count cursor-pointer flex items-center text-[var(--el-text-color-regular)]" @click="onStar(comment)">
        <el-icon :size="20"><IconLike v-if="!comment.liked" /><IconLiked class="text-[var(--el-color-primary)]" v-else /></el-icon>
        <span class="text-xs" v-if="comment.likedCount">{{ comment.likedCount > 1000 ? (comment.likedCount / 1000).toFixed(1) + 'k' : comment.likedCount }}</span>
      </div>
    </div>
    <div class="content ml-10 text-sm">
      {{ comment.content }}
      <div v-if="comment.beReplied && comment.beReplied?.filter((val) => val.commentId !== comment.commentId).filter((item) => item.content).length > 0">
        <CommentTree v-for="item in comment.beReplied" :key="item.id" :comment="item" />
      </div>
    </div>
  </div>
</template>

<script setup name="CommentTree">
defineProps({
  comment: {
    type: Object,
    default: () => null,
  },
})
const onStar = (comment) => {
  comment.liked = !comment.liked
  comment.likedCount = comment.likedCount || 0
  comment.likedCount += comment.liked ? 1 : -1
}
</script>

<style>
</style>