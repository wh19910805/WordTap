<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue'

console.log('[App.vue] 组件创建')

onBeforeMount(() => {
  console.log('[App.vue] onBeforeMount 执行')
})

onMounted(() => {
  console.log('[App.vue] onMounted 执行')
})
</script>

