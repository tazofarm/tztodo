<template>
  <!-- 설정 섹션 전체 컨테이너 -->
  <div class="setting-section">
    <!-- 배경 설정 라벨 -->
    <label>※ 배경 설정 </label>

    <!-- 세로 정렬된 라디오 버튼 그룹 -->
    <div class="vertical-radio">
      <!-- 라이트/다크 모드 선택 라디오 버튼 그룹 -->
      <div class="mode-row">
        <label>
          <input type="radio" value="light" v-model="modelTheme" />
          <span>라이트모드</span>
        </label>
        <label>
          <input type="radio" value="dark" v-model="modelTheme" />
          <span>다크모드</span>
        </label>
 
        <label>
          <input type="radio" value="custom" v-model="modelTheme" />
          <span>색상선택</span>
        </label>
        <!-- 사용자 색상 박스: 클릭 시 팔레트 열림 -->
        <span
          class="inline-color-box"
          :style="boxStyle"
          @click="handleClick"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue에서 emit, model, computed 등 불러오기
import { defineEmits, defineModel, computed } from 'vue';

// 부모 컴포넌트로 palette 열기 이벤트 정의
const emit = defineEmits(['show-palette']);

// 외부에서 전달받는 테마 모델(light | dark | custom)
const modelTheme = defineModel<string>('theme');

// 외부에서 전달받는 사용자 정의 색상(hex 코드 등)
const modelCustomColor = defineModel<string>('customColor');

// 색상 박스의 스타일을 동적으로 계산
const boxStyle = computed(() => ({
  backgroundColor: modelCustomColor.value, // 사용자 선택 색상
  opacity: modelTheme.value === 'custom' ? 1 : 0.4, // custom이 아닐 경우 흐리게
  cursor: modelTheme.value === 'custom' ? 'pointer' : 'default', // custom인 경우만 클릭 가능
}));

// 색상 박스 클릭 시 호출: custom인 경우에만 팔레트 열기 이벤트 발생
function handleClick() {
  if (modelTheme.value === 'custom') emit('show-palette');
}
</script>

<style scoped>
/* 배경 설정 전체 박스 스타일 */
.setting-section {
  background-color: #e0e0e0;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
}

/* 상단 라벨 ("※ 배경 설정") 스타일 */
.setting-section label:first-child {
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 4px;
  color: #000;
}

/* 라디오 버튼 공통 스타일 */
.vertical-radio label {
  color: #000;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 1px;
}

/* 배경설정 선택 글씨 */
.vertical-radio label span {
  font-size: 1rem; /* 글자 크기 통일 */
  line-height: 1;
}

/* 라이트/다크 모드 라디오 버튼 행 스타일 */
.vertical-radio .mode-row,
/* 커스텀 색상 라디오 + 박스 행 스타일 */
.vertical-radio .color-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

/* 색상 미리보기 박스 스타일 */
.inline-color-box {
  width: 28px;
  height: 28px;
  border: 2px solid #666;
  border-radius: 4px;
  cursor: pointer;
}




</style>
