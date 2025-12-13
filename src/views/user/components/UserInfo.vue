<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-1/2 h-auto flex flex-col gap-4">
      <el-form ref="formRef" :model="form">
        <!-- avatar -->
        <el-form-item label="头像">
          <el-avatar size="large" shape="circle" :src="DEFAULT_AVATAR" />
        </el-form-item>
        <el-form-item label="姓名" :required="requiredFields">
          <el-input v-model="form.username" placeholder="请输入姓名" :disabled="isEditable" />
        </el-form-item>
        <el-form-item label="密码" :required="requiredFields">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
            :disabled="isEditable"
          />
        </el-form-item>
        <el-form-item label="邮箱" :required="requiredFields">
          <el-input v-model="form.email" placeholder="请输入邮箱" :disabled="isEditable" />
        </el-form-item>
        <el-form-item label="角色" :required="requiredFields">
          <el-select v-model="form.role" placeholder="请选择角色" :disabled="isEditable">
            <el-option
              v-for="(item, index) in USER_ROLE"
              :key="index"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="requiredFields" class="w-full h-auto flex items-center justify-end">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed, watchEffect } from 'vue'
import { IUser, IUserUpdateReqDto } from '../../../types/common'
import { updateUser } from '../../../server/api/user'
import { Message, getUserId } from '../../../utils'
import { DEFAULT_AVATAR } from '../../../const'

type userInfoProps = {
  mode: 'view' | 'edit'
  data: IUser | null
}

const props = withDefaults(defineProps<userInfoProps>(), {
  mode: 'view',
  data: null,
})

const { mode, data } = toRefs(props)

const formRef = ref()
const form = reactive<IUser>({
  id: data.value?.id ?? '',
  username: data.value?.username ?? '',
  email: data.value?.email ?? '',
  password: data.value?.password ?? '',
  role: data.value?.role ?? '',
  status: data.value?.status ?? '',
  isDelete: data.value?.isDelete ?? false,
  createAt: data.value?.createAt ?? '',
  updateAt: data.value?.updateAt ?? '',
})

const initData = () => {
  form.username = data.value?.username ?? ''
  form.password = data.value?.password ?? ''
  form.email = data.value?.email ?? ''
  form.role = data.value?.role ?? ''
}

const requiredFields = computed(() => {
  return mode.value === 'edit'
})

const isEditable = computed(() => {
  return mode.value === 'view'
})

const emits = defineEmits(['update'])

const handleSubmit = async () => {
  const params: IUserUpdateReqDto = {
    id: getUserId(),
    username: form.username,
    password: form.password,
    email: form.email,
    role: form.role,
  }
  const res = await updateUser(params)
  const { code } = res.data
  if (code === 200) {
    Message.success('更新用户信息成功')
    emits('update')
  } else {
    console.error('Failed to update user:', res)
    Message.warning('更新用户信息失败')
  }
}

watchEffect(() => {
  initData()
})
</script>

<style scoped></style>
