<template>
  <div class="w-full h-auto flex flex-col">
    <el-card v-loading="loading" shadow="never" class="w-full">
      <template #header>
        <div class="w-full h-auto flex justify-between items-center">
          <div class="text-[1rem] w-auto flex items-center whitespace-nowrap">公告</div>
          <el-link type="primary" underline="never">查看更多</el-link>
        </div>
      </template>
      <div v-if="showNotices" class="w-full h-auto flex flex-col gap-2">
        <el-scrollbar>
          <div
            v-for="(item, index) in notices.slice(0, 3)"
            :key="index"
            class="w-full h-auto flex mb-2 items-center gap-2"
          >
            <el-tag :type="getNoticeStatus(item?.status ?? '')">
              {{ item.name }}
            </el-tag>
            <div class="flex-1 text-[14px] whitespace-nowrap text-ellipsis">
              {{ item.content }}
            </div>
            <div
              class="w-auto text-gray-300 h-auto flex items-center whitespace-normal text-[14px]"
            >
              {{ item.createAt }}
            </div>
          </div>
        </el-scrollbar>
      </div>
      <el-empty v-else description="暂无公告" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { INoticeResDto } from '@/types/common.ts'

type alertCenterProps = {
  notices: INoticeResDto[]
  loading: boolean
}

const props = withDefaults(defineProps<Partial<alertCenterProps>>(), {
  notices: () => [],
  loading: false,
})

const noticeStatusMap: Record<string, string> = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  DANGER: 'danger',
}

const getNoticeStatus = (index: string): 'info' | 'success' | 'warning' | 'error' | 'danger' => {
  return noticeStatusMap[index] ?? 'info'
}

const { notices, loading } = toRefs(props)

const showNotices = computed(() => notices.value.length > 0)
</script>

<style scoped></style>
