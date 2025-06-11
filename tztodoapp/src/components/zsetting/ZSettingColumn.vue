<template>
  <!-- 배열 수 설정 섹션 -->
  <div class="setting-section">
    <!-- 항목 제목 라벨 -->
    <label>※ 배열 수</label>

    <!-- 라디오 버튼 그룹 (2줄 배열 구성) -->
    <div class="radio-group">
      <!-- 첫 번째 줄: 1열 ~ 4열 -->
      <div class="radio-row">
        <label><input type="radio" value="1" v-model="modelValue" /> 1</label>
        <label><input type="radio" value="2" v-model="modelValue" /> 2</label>
        <label><input type="radio" value="3" v-model="modelValue" /> 3</label>
        <label><input type="radio" value="4" v-model="modelValue" /> 4</label>

        <label><input type="radio" value="5" v-model="modelValue" /> 5</label>
        <label><input type="radio" value="6" v-model="modelValue" /> 6</label>
        <label><input type="radio" value="7" v-model="modelValue" /> 7</label>
        <label><input type="radio" value="8" v-model="modelValue" /> 8</label>
      </div>
    </div>
  </div>
</template>

<script setup>
// defineModel을 통해 부모 컴포넌트와 양방향 데이터 바인딩 수행
const modelValue = defineModel();
</script>

<style scoped>
/* 전체 설정 섹션 컨테이너 스타일 */
.setting-section {
  background-color: #e0e0e0; /* 회색 배경 */
  padding: 12px; /* 내부 여백 */
  border-radius: 8px; /* 둥근 모서리 */
  margin-top: 15px; /* 위쪽 여백 */
}

/* 제목 라벨 스타일 */
.setting-section label:first-child {
  font-weight: bold; /* 글씨 두껍게 */
  font-size: 1.1rem; /* 글씨 크게 */
  display: block; /* 한 줄 전체 차지 */
  margin-bottom: 4px; /* 아래 여백 */
  color: #000; /* 검정색 */
}

/* 라디오 그룹 전체 정렬 */
.radio-group {
  display: flex;
  gap: 10px; /* 행 간격 */
  flex-wrap: wrap; /* 줄바꿈 허용 */
  margin-top: 5px;
  flex-direction: column; /* 두 줄로 정렬되도록 */
}

/* 개별 라디오 버튼 라벨 스타일 */
.radio-group label {
  white-space: nowrap; /* 줄바꿈 방지 */
  color: #000; /* 글자 색 */
  font-weight: bold; /* 두껍게 */
  display: inline-flex; /* 수평 정렬 */
  align-items: center; /* 수직 정렬 */
  gap: 4px; /* 요소 간 간격 */
  
}

/* 라디오 버튼 행: 각 줄에서 버튼들 정렬 */
.radio-row {
  display: flex; /* 가로 정렬 */
  gap: 10px; /* 버튼 간 간격 */
  margin-bottom: 0px; /* 아래 여백 */
}



</style>
