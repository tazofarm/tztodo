<template>
  <!-- 버튼 크기 설정 섹션 -->
  <div class="setting-section">
    <!-- 설정 항목 제목 라벨 -->
    <label>※ 버튼 크기</label>

    <!-- 숫자 선택 라디오 버튼 그룹 -->
    <div class="radio-group">
      <!-- 각 숫자에 해당하는 라디오 버튼. 클릭 시 modelValue에 값이 바인딩됨 -->
      <label><input type="radio" value="1" v-model="modelValue" /> 1</label>
      <label><input type="radio" value="2" v-model="modelValue" /> 2</label>
      <label><input type="radio" value="3" v-model="modelValue" /> 3</label>
      <label><input type="radio" value="4" v-model="modelValue" /> 4</label>
      <label><input type="radio" value="5" v-model="modelValue" /> 5</label>
    </div>
  </div>
</template>

<script setup>
// 부모 컴포넌트와 v-model로 양방향 바인딩될 값 정의
const modelValue = defineModel();
</script>

<style scoped>
/* 설정 섹션 전체 컨테이너 스타일 */
.setting-section {
  background-color: #e0e0e0; /* 회색 배경 */
  padding: 12px; /* 내부 여백 */
  border-radius: 8px; /* 모서리 둥글게 */
  margin-top: 15px; /* 위쪽 여백 */
}

/* 섹션 제목 라벨 스타일 */
.setting-section label:first-child {
  font-weight: bold; /* 글자 두껍게 */
  font-size: 1.1rem; /* 약간 크게 */
  display: block; /* 블록 요소 */
  margin-bottom: 4px; /* 아래 여백 */
  color: #000; /* 검정색 글씨 */
}

/* 라디오 버튼을 포함한 그룹 컨테이너 */
.radio-group {
  display: flex; /* 가로 정렬 */
  gap: 10px; /* 버튼 간 간격 */
  flex-wrap: wrap; /* 줄바꿈 허용 */
  margin-top: 5px; /* 위쪽 여백 */
}

/* 각 라벨 스타일 */
.radio-group label {
  white-space: nowrap; /* 줄바꿈 방지 */
  color: #000; /* 검정색 */
  font-weight: bold; /* 글씨 두껍게 */
  display: inline-flex; /* 내부 요소와 나란히 정렬 */
  align-items: center; /* 수직 정렬 */
  gap: 4px; /* 아이콘/텍스트 간격 */
}
</style>
