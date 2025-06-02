<template>
  <div class="main-content">
    <slot />
  </div>
</template>

<script setup>
// 이 컴포넌트는 페이지 전환 시 실제 내용을 보여주는 컨테이너 역할을 합니다
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 16px;
  background-color: var(--ion-background-color);
  color: var(--ion-text-color);
  overflow-y: auto;
}
</style>
