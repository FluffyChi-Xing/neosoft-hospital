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
          <div v-for="(item, index) in notices" :key="index" class="w-full h-auto flex mb-2 items-center gap-2">
            <el-tag :type="noticeStatusMap[item.type]">
              {{ item.name }}
            </el-tag>
            <el-tooltip :content="item.content">
              <div class="flex-1 text-[14px] whitespace-nowrap text-ellipsis">
                {{ item.content }}
              </div>
            </el-tooltip>
          </div>
        </el-scrollbar>
      </div>
      <el-empty v-else description="暂无公告" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { INoticeResDto } from '@/types/common'

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

const { notices, loading } = toRefs(props)

const showNotices = computed(() => notices.value.length > 0)
</script>

<style scoped></style>
