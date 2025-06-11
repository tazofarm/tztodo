<template>
  <!-- 배경 오버레이: 배경 클릭 시 팝업 닫힘 -->
  <div id="popupOverlay" @click.self="onClose">
    <div id="popup">
      <!-- 보기 모드 -->
      <template v-if="mode === 'view'">
        <div class="text">{{ text }}</div>
        <div class="button-group">
          <!-- 수정 버튼 클릭 시 'edit' 모드로 전환 -->
          <button @click="mode = 'edit'">✏️ 수정</button>
          <!-- 삭제 이벤트 부모로 전달 -->
          <button @click="onDelete">🗑 삭제</button>
          <!-- 닫기 -->
          <button @click="onClose">❌ 취소</button>
        </div>
      </template>

      <!-- 수정 모드 -->
      <template v-else>
        <!-- 수정 입력창: 초기값은 text -->
        <textarea ref="editBox" v-model="editedText" rows="5" />
        <div class="button-group">
          <!-- 수정 완료 시 텍스트 전달 -->
          <button @click="onConfirmEdit">확인</button>
          <!-- 수정 취소 -->
          <button @click="onClose">취소</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

// 부모 컴포넌트에서 전달받는 props
const props = defineProps({
  text: String,     // 보여줄 텍스트
  show: Boolean     // 팝업 표시 여부 (실제로는 사용되지 않음)
});

// 부모에게 이벤트를 전달할 emit 정의
const emits = defineEmits(['close', 'edit', 'delete']);

// 내부 상태
const mode = ref('view');            // 'view' 또는 'edit' 모드
const editedText = ref(props.text);  // 수정 중인 텍스트
const editBox = ref(null);           // textarea DOM 참조

// text prop이 바뀌면 편집 텍스트도 초기화, 모드도 'view'로
watch(() => props.text, (newVal) => {
  editedText.value = newVal;
  mode.value = 'view';
});

// 'edit' 모드로 바뀌면 textarea에 포커스/선택
watch(mode, async (newVal) => {
  if (newVal === 'edit') {
    await nextTick(); // DOM 업데이트 기다림
    if (editBox.value) {
      editBox.value.focus();
      editBox.value.select();
    }
  }
});

// 닫기, 삭제, 수정 이벤트 처리
const onClose = () => emits('close');
const onDelete = () => emits('delete');
const onConfirmEdit = () => emits('edit', editedText.value.trim());
</script>

<style scoped>
/* 오버레이: 화면 전체를 덮고 중앙 정렬 */
#popupOverlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); /* 반투명 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 팝업 박스 본체 */
#popup {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 240px;
  min-height: 300px;
}

/* 텍스트 표시 영역 */
.text {
  margin-bottom: 1em;
  white-space: pre-wrap; /* 줄바꿈 유지 */
}

/* 수정용 텍스트 박스 */
textarea {
  width: 100%;
  margin-bottom: 12px;
  font-size: 16px;
  color: white;              /* 글씨 색 */
  background-color: black;   /* 배경 색 */
}

/* 버튼 영역 */
.button-group {
  margin-top: 30px;
}

/* 버튼 스타일 */
.button-group button {
  display: block;
  width: 100%;
  margin: 14px 0;
  padding: 14px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
}
</style>