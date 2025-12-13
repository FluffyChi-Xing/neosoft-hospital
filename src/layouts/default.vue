<template>
  <div class="w-screen h-screen flex">
    <el-container>
      <el-header class="w-full h-full flex">
        <TheHeader>
          <template #action>
            <el-dropdown placement="bottom">
              <el-avatar :src="DEFAULT_AVATAR" shape="square" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="jump2userCenter">用户中心</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </TheHeader>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <TheMenu />
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { TheMenu } from '@/components'
import TheHeader from '@/components/TheHeader.vue'
import useUserStore from '@/store/user'
import { DEFAULT_AVATAR, DEFAULT_USER } from '@/const'

const router = useRouter()
const useStore = useUserStore()

const logout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}

const jump2userCenter = () => {
  router.push('/user/index')
}

onMounted(() => {
  useStore.updateUser(DEFAULT_USER)
})
</script>

<style scoped>
:deep() {
  .el-header {
    padding: 0;
  }
}
</style>
