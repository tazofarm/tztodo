<template>
  <!-- 글자 크기 설정 섹션 -->
  <div class="setting-section">
    <!-- 항목 제목 라벨 -->
    <label>※ 글자 크기</label>

    <!-- 라디오 버튼 그룹 (한 줄로 구성) -->
    <div class="radio-group">
      <div class="radio-row">
        <!-- 각 글자 크기를 나타내는 라디오 버튼 (값: 1~5) -->
        <label><input type="radio" value="1" v-model="modelValue" /> 1</label>
        <label><input type="radio" value="2" v-model="modelValue" /> 2</label>
        <label><input type="radio" value="3" v-model="modelValue" /> 3</label>
        <label><input type="radio" value="4" v-model="modelValue" /> 4</label>
        <label><input type="radio" value="5" v-model="modelValue" /> 5</label>
      </div>
    </div>
  </div>
</template>

<script setup>
// 부모 컴포넌트와 양방향 바인딩되는 값 정의
const modelValue = defineModel();
</script>

<style scoped>
/* 전체 설정 섹션 스타일 */
.setting-section {
  background-color: #e0e0e0; /* 회색 배경 */
  padding: 12px; /* 내부 여백 */
  border-radius: 8px; /* 둥근 모서리 */
  margin-top: 15px; /* 상단 여백 */
}

/* 제목 라벨 스타일 */
.setting-section label:first-child {
  font-weight: bold; /* 글씨 두껍게 */
  font-size: 1.1rem; /* 크기 증가 */
  display: block; /* 한 줄 전체 차지 */
  margin-bottom: 4px; /* 하단 여백 */
  color: #000; /* 검정색 */
}

/* 라디오 버튼 그룹 컨테이너 */
.radio-group {
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  gap: 10px; /* 버튼 간 간격 */
  margin-top: 5px; /* 상단 여백 */
}

/* 각 라벨 공통 스타일 */
.radio-group label {
  white-space: nowrap; /* 줄바꿈 방지 */
  color: #000; /* 글씨 색상 */
  font-weight: bold; /* 글씨 두껍게 */
  display: inline-flex; /* 아이콘+텍스트 수평 정렬 */
  align-items: center; /* 수직 정렬 */
  gap: 4px; /* 아이콘과 글자 간격 */
}

/* 라디오 버튼들을 정렬하는 행 */
.radio-row {
  display: flex; /* 가로 정렬 */
  gap: 10px; /* 버튼 간 간격 */
  margin-bottom: 1px; /* 하단 여백 */
}
</style>