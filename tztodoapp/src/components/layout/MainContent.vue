<template>
  <!-- ✅ 메인 콘텐츠 출력 영역: 자식 페이지가 이곳에 출력됩니다 -->
  <div class="main-content">
    <slot />
  </div>
</template>

<script setup>
// 이 컴포넌트는 페이지 본문 영역으로, 스크롤/패딩 등 UI 표현 담당
</script>

<style scoped>
.main-content {
  flex: 1; /* ✅ 남는 공간을 자동으로 채움 (부모가 flex인 경우에만) */
  padding: 16px; /* ✅ 내용 여백 */
  background-color: var(--ion-background-color); /* ✅ 설정 테마 반영 */
  color: var(--ion-text-color); /* ✅ 글자색도 테마에 따라 자동 적용 */
  overflow-y: auto; /* ✅ 스크롤 가능 (콘텐츠 많을 경우) */
}
</style>