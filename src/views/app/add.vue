<template>
  <el-dialog :z-index="1000" modal-class="backdrop-blur" :title="`${form.id && has(form.id, 'apps') ? '编辑' : '添加'}应用`" v-model="visible" width="360px" @close="onClose">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="108px">
      <el-form-item label="推荐应用" prop="id">
        <el-select v-model="form.id" popper-class="backdrop-blur" placeholder="请选择应用名称" clearable filterable @change="(val) => (form = { ...apps.find((el) => el.id == val) })">
          <el-option v-for="item in apps" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="应用地址" prop="url">
        <el-input v-model="form.url" placeholder="请输入应用地址: https://"></el-input>
      </el-form-item>
      <el-form-item label="应用图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入图标或链接"></el-input>
      </el-form-item>
      <el-form-item label="应用描述" prop="desc">
        <el-input type="textarea" maxlength="150" v-model="form.desc" placeholder="请输入描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { has } = appStore
const apps = ref(appStore.recommended.filter((el) => !el.affix))
const emit = defineEmits(['update:modelValue', 'submit'])
const props = defineProps({
  value: Boolean,
  rowData: Object,
})
const visible = ref(props.value)
const form = ref({})
const rules = ref({
  name: [{ required: true, message: '请输入应用名称', trigger: 'change' }],
  url: [{ required: true, message: '请输入正确的地址', trigger: 'change', pattern: /^https?:\/\// }],
})
watch(props, () => {
  form.value = { ...props.rowData }
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
  form.value = {}
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}
</script>
