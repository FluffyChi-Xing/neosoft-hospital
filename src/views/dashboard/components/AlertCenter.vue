<template>
  <div class="w-full h-auto flex flex-col">
    <el-card shadow="never" class="w-full">
      <template #header>
        <div class="w-full h-auto flex justify-between items-center">
          <div class="text-[1rem] w-auto flex items-center whitespace-nowrap">公告</div>
          <el-link type="primary" underline="never">查看更多</el-link>
        </div>
      </template>
      <div v-if="showNotices" class="w-full h-auto flex flex-col gap-2"></div>
      <el-empty v-else description="暂无公告" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { INotice } from '@/views/dashboard/types'

type alertCenterProps = {
  notices: INotice[]
}

const props = withDefaults(defineProps<Partial<alertCenterProps>>(), {
  notices: () => [],
})

const { notices } = toRefs(props)

const showNotices = computed(() => notices.value.length > 0)
</script>

<style scoped></style>
