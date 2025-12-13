<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </template>
      <template #fallback>
        <div class="w-screen h-screen flex items-center justify-center">
          <el-skeleton animated loading :rows="7" />
        </div>
      </template>
    </Suspense>
  </RouterView>
</template>

<style scoped></style>
