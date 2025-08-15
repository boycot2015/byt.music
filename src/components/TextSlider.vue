<template>
  <div class="scroll-wrap relative" ref="scrollWrap">
    {{ msg || '--' }}
  </div>
</template>
<script setup>
const props = defineProps({
  msg: String,
})
const scrollWrap = ref(null)
const textMove = (oCon, max = 8) => {
  if (oCon && oCon !== null) {
    oCon._move = null
    const step = -1
    if (oCon.textContent.length <= max) {
      clearInterval(oCon._move)
      return
    } else {
      autoRoll(oCon, step)
    }
    oCon._move = setInterval(() => {
      autoRoll(oCon, step)
    }, 30)
  }
}
const autoRoll = (oCon, step) => {
  console.log(-oCon.offsetWidth + oCon.parentNode.offsetWidth, oCon.offsetLeft, step, 'textMove')
  if (oCon.offsetLeft < -oCon.offsetWidth + oCon.parentNode.offsetWidth) {
    oCon.style.left = -oCon.offsetWidth + oCon.parentNode.offsetWidth + 'px'
    if (oCon.offsetLeft > 0) oCon.style.left = 0 + 'px'
    clearInterval(oCon._move)
    return
  }
  if (oCon.offsetLeft > 0) {
    oCon.style.left = -oCon.offsetWidth / 2 + 'px'
  }
  oCon.style.left = -oCon.offsetLeft + step + 'px'
}
onMounted(() => {
  // nextTick(() => {
  //   textMove(scrollWrap.value, 10)
  // })
})
watch(props, () => {
  if (scrollWrap.value._move) clearInterval(scrollWrap.value._move)
  // textMove(scrollWrap.value, 20)
})
</script>
<style scoped>
.scroll-wrap {
  white-space: nowrap;
}
</style>