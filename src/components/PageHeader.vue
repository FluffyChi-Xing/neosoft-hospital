<template>
  <el-card shadow="never" class="w-full h-fit">
    <div class="w-full h-auto grid grid-cols-2 gap-4">
      <div class="w-full h-fit flex items-start gap-4">
        <!--        <el-button v-if="showBack" @click="onBack" type="text" style="padding: 0">-->
        <!--          <el-icon><ArrowLeft /></el-icon>-->
        <!--        </el-button>-->
        <div class="flex items-center">{{ pageHeaderContent }}</div>
      </div>
      <div class="w-full h-auto flex justify-end items-center gap-4">
        <slot name="action" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
// import { ArrowLeft } from '@element-plus/icons-vue'

type pageHeaderProps = {
  content: string
  callback: () => void
  showBack: boolean
}

const props = withDefaults(defineProps<Partial<pageHeaderProps>>(), {
  content: '',
  callback: () => {},
  showBack: true,
})

const { content, callback, showBack } = toRefs(props)

const pageHeaderContent = computed(() => {
  return content.value || 'Page Header'
})

const router = useRouter()

const onBack = async () => {
  if (showBack.value && callback.value) {
    await callback.value()
  } else {
    router.back(-1)
  }
}
</script>

<style scoped></style>
