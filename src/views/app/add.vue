<template>
  <el-dialog title="添加应用" v-model="visible" width="320px" @close="onClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="应用地址" prop="url">
        <el-input v-model="form.url" placeholder="请输入应用地址: https://"></el-input>
      </el-form-item>
      <el-form-item label="应用图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入应用图标"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps({
  value: Boolean,
})
const visible = ref(props.value)
const form = ref({})
const rules = ref({
  name: [{ required: true, message: '请输入应用名称', trigger: 'change' }],
  url: [{ required: true, message: '请输入正确的地址', trigger: 'input', pattern: /^https?:\/\// }],
})
const formRef = ref(null)
const submit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', form.value)
      emit('update:modelValue', false)
    } else {
      return false
    }
  })
}
const onClose = () => {
  emit('update:modelValue', false)
  formRef.value?.resetFields()
}
</script>
