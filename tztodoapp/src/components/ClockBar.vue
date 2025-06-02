<template>
  <div class="clock-bar">
    <span>{{ time }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')

const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString()
}

let intervalId
onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.clock-bar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ion-color-primary);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
