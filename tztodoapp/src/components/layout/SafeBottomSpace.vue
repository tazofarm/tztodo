<template>
  <div class="safe-bottom"></div>
</template>

<script setup>
// 설정에서 theme 색상을 적용하려면, body class로 색을 바꾸고
// CSS에서 배경색을 body class에 따라 설정
</script>

<style scoped>
.safe-bottom {
  height: env(safe-area-inset-bottom, 32px); /* 홈 키 회피용 */
  background-color: var(--custom-bg, #f5f5f5); /* 설정된 배경색 또는 fallback */
}
</style>