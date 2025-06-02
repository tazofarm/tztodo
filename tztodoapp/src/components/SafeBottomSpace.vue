<template>
  <div class="safe-bottom-space"></div>
</template>

<script setup>
// 이 컴포넌트는 하단 홈버튼과 겹치지 않도록 여백을 제공합니다
</script>

<style scoped>
.safe-bottom-space {
  height: env(safe-area-inset-bottom, 24px);
  background-color: var(--ion-background-color);
}
</style>
