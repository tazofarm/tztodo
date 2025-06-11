<template>
  <!-- 색상 선택 모달 (항상 열려 있음) -->
  <ion-modal :is-open="isOpen" @did-dismiss="onClose" class="custom-modal">
    <div class="modal-content">
      <!-- 모달 제목 -->
      <h3>색상 선택</h3>

      <!-- 색상 격자 (3행 x 6컬럼) -->
      <div class="color-grid">
        <!-- 행 반복 -->
        <div v-for="(row, rowIndex) in colorGrid" :key="rowIndex" class="color-row">
          <!-- 각 행에서 색상 버튼 반복 -->
          <!-- 배경색 적용 --> 
          <!-- 클릭 시 색상 선택 -->  
          <!-- 선택된 색상 표시 -->  
          <button
            v-for="color in row"
            :key="color"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)" 
            :class="{ selected: modelColor === color }" 
          />
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
// IonModal: Ionic의 모달 컴포넌트
import { IonModal } from '@ionic/vue';
// vue 기능: 이벤트 emit, v-model 선언
import { defineEmits, defineModel } from 'vue';

// 부모로 모달 닫기 이벤트 전달
const emit = defineEmits(['close']);

// 선택된 색상 모델 (부모 컴포넌트와 바인딩)
const modelColor = defineModel<string>('color');


//추가: defineProps로 isOpen 받기
const props = defineProps<{ isOpen: boolean }>();

// 색상 표 배열 (3행 6열 구조)
const colorGrid = [
  ['#fce4ec', '#f8bbd0', '#ffe0b2', '#fff9c4', '#e1bee7', '#b3e5fc'], // 파스텔 톤
  ['#e91e63', '#ff5722', '#ffeb3b', '#8bc34a', '#00bcd4', '#3f51b5'], // 중간 계열
  ['#880e4f', '#bf360c', '#f57f17', '#33691e', '#006064', '#1a237e'], // 진한 색상들
];

// 색상 버튼 클릭 시 호출되는 함수
function selectColor(color: string) {
  modelColor.value = color; // 모델 업데이트
  emit('close'); // 모달 닫기
}

// 모달 dismiss 이벤트 발생 시 (백그라운드 클릭 등)
function onClose() {
  emit('close'); // 부모에 닫기 이벤트 전달
}
</script>

<style scoped>
/* Ionic 모달의 커스텀 스타일 */
.custom-modal {
  --width: fit-content; /* 내용에 맞게 크기 조절 */
  --height: fit-content;
  --max-width: 320px;
  --max-height: 360px;
  --border-radius: 12px;
  --background: transparent; /* 배경 투명 */
}

/* 모달 내부 컨텐츠 스타일 */
.modal-content {
  padding: 16px;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  background: #fff; /* 흰색 배경 */
  border-radius: 12px;
}

/* 전체 색상 그리드 영역 */
.color-grid {
  margin-top: 10px;
  display: flex;
  flex-direction: column; /* 행 단위 정렬 */
  align-items: center;
  gap: 6px; /* 행 간격 */
}

/* 각 색상 행 (컬럼 그룹) */
.color-row {
  display: flex;
  gap: 10px; /* 버튼 간 간격 */
  justify-content: center;
}

/* 색상 버튼 스타일 */
.color-row button {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid #ccc;
  cursor: pointer;
}

/* 선택된 색상의 테두리 강조 */
.color-row button.selected {
  border: 2px solid #000;
}
</style>
