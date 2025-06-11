<template>
  <!-- ✅ 시계 표시 영역 (노치/상단바 회피 + 현재 시각 출력) -->
  <div class="clock-bar">
    <span>{{ time }}</span>
  </div>
</template>

<script setup>
// ✅ Vue 기본 API 불러오기
import { ref, onMounted, onUnmounted } from 'vue'

// ✅ 현재 시간을 담는 반응형 변수
const time = ref('')

// ✅ 현재 시간을 hh:mm:ss 형식으로 업데이트
const updateTime = () => {
  const now = new Date()
  time.value = now.toLocaleTimeString()
}

// ✅ 1초마다 시간 갱신하는 타이머 설정
let intervalId
onMounted(() => {
  updateTime() // 최초 실행
  intervalId = setInterval(updateTime, 1000)
})

// ✅ 컴포넌트가 사라지면 타이머 제거
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.clock-bar {
  height: env(safe-area-inset-top, 48px); /* ✅ 시계/노치 영역 회피 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--custom-bg, var(--ion-color-primary)); /* ✅ 설정 테마 연동 */
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>