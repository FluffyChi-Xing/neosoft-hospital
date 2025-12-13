<template>
  <div class="w-full h-full bg-yellow-500 flex items-center justify-between gap-4 px-5">
    <h1 class="text-xl font-bold text-white flex items-center hover:underline cursor-pointer" @click="refreshPage">
      <img src="@/assets/img/logo.svg" alt="site-logo" class="object-contain">
      <el-divider direction="vertical" />
      {{ PAGE_HEADER_CONTENT }}
    </h1>
    <div class="w-full h-full flex flex-1 items-center justify-end">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PAGE_HEADER_CONTENT } from '@/const'

const refreshPage = () => {
  location.reload()
}
</script>

<style scoped></style>
