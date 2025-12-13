<template>
  <div class="display-card">
    <el-card :shadow="shadow" class="w-full">
      <div class="w-full h-full grid grid-cols-2 items-center gap-4">
        <div class="w-full h-full flex flex-col justify-center">
          <div
            class="w-fit h-fit rounded-[40px] box-border flex items-start justify-center p-2 bg-gray-200"
          >
            <img :src="icon" alt="prefix-icon" class="object-contain" />
          </div>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
          <div class="w-full h-auto flex text-gray-400 text-[1rem] items-center">
            {{ title }}
          </div>
          <div class="w-full h-auto flex text-[2rem] gap-4 font-bold items-baseline">
            {{ data }}
            <span class="text-gray-400 text-sm">{{ suffix }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
type displayCardProps = {
  data: number
  shadow: 'never' | 'always' | 'hover'
  title: string
  suffix: string
  icon: string
}

const props = withDefaults(defineProps<Partial<displayCardProps>>(), {
  data: 0,
  shadow: 'always',
  title: '展示数据',
  suffix: '个',
  icon: 'src/assets/img/dashboard-icon-1.svg',
})

const { data, shadow, title, suffix, icon } = toRefs(props)
</script>

<style scoped>
:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.display-card {
  width: 100%;
  height: 150px;
  display: flex;
  cursor: pointer;

  .object-contain {
    transition: 0.5s all ease;
  }

  &:hover {
    .object-contain {
      transform: scale(1.3);
    }
  }
}
</style>
