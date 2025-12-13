<template>
  <div
    class="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800 p-4 gap-4"
  >
    <!-- title -->
    <div class="w-auto h-auto mb-10 flex items-center text-white text-2xl font-bold">
      餐 饮 管 理 系 统
    </div>
    <div class="w-auto h-auto flex">
      <el-card header="登录" shadow="never" style="width: 500px">
        <div class="w-full h-auto flex flex-col">
          <el-form ref="formRef" :model="form" label-width="80px">
            <el-form-item label="用户名" required>
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input
                v-model="form.password"
                type="password"
                show-password
                placeholder="请输入密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="handleSubmit" class="w-full">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IUserLogin } from '@/types/common'
import { userLogin } from '@/server/api/user'
import useUserStore from '@/store/user'
import { Notice } from '@/utils'
import useStorage from '@/hook/storage'
import useLoading from '@/hook/loading'

const formRef = ref()
const form = reactive({
  username: '',
  password: '',
})
const router = useRouter()
const userStore = useUserStore()
const { set } = useStorage('local')
const { loading, start, done } = useLoading(false)

const handleSubmit = async () => {
  const params: IUserLogin = {
    username: form.username,
    password: form.password,
  }
  if (await formRef.value.validate()) {
    start()
    const res = await userLogin(params)
    done()
    const { code, data } = res
    if (code === 200 && data) {
      set('userInfo', data)
      userStore.updateUser(data)
      await router.push('/index')
      Notice({
        type: 'success',
        message: '登录成功',
      })
    } else {
      done()
      ElMessage.error('登录失败，请检查用户名和密码')
    }
  }
}
</script>

<style scoped></style>
