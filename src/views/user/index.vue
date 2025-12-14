<template>
  <div class="w-full h-full flex flex-col gap-4">
    <PageHeader content="用户信息">
      <template #action>
        <el-button type="warning" @click="getUserInfo">刷新</el-button>
      </template>
    </PageHeader>
    <div class="w-full h-auto flex-1 flex flex-col">
      <el-card shadow="never" class="w-full h-full">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <el-tabs v-model="activeIndex" class="w-full h-full">
            <el-tab-pane label="查看" name="view">
              <UserInfo mode="view" :data="user" />
            </el-tab-pane>
            <el-tab-pane label="编辑" name="edit">
              <UserInfo mode="edit" :data="user" @update="handleUpdateDetail" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserDetail } from '@/server/api/user.ts'
import PageHeader from '../../components/PageHeader.vue'
import UserInfo from './components/UserInfo.vue'
import useStorage from '../../hook/storage'
import type { userStoreType } from '@/store/user/types.ts'
import useUserStore from '../../store/user'
import { IResponse } from '@/types/common.ts'

const userStore = useUserStore()
const user = ref<userStoreType | null>()
const activeIndex = ref<string>('view')
const { get } = useStorage('local')

const getUserInfo = async () => {
  const userInfo = get('userInfo')
  const { id } = userInfo
  const res = await getUserDetail(id ?? 0)
  const { code, data } = res as unknown as IResponse<never>
  if (code === 200 && data) {
    user.value = data
    userStore.updateUser(data)
  } else {
    console.error('Failed to fetch user data:', res)
    user.value = null
  }
}

const initData = async () => {
  await getUserInfo()
}

const handleUpdateDetail = async () => {
  activeIndex.value = 'view'
  await getUserInfo()
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
:deep(.el-card__body) {
  display: flex;
  height: 100%;
}
</style>
