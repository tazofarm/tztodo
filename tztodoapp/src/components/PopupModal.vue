<template>
  <div id="popupOverlay" @click.self="onClose">
    <div id="popup">
      <template v-if="mode === 'view'">
        <div class="text">{{ text }}</div>
        <div class="button-group">
          <button @click="mode = 'edit'">✏️ 수정</button>
          <button @click="onDelete">🗑 삭제</button>
          <button @click="onClose">❌ 취소</button>
        </div>
      </template>
      <template v-else>
        <textarea v-model="editedText" rows="5" />
        <div class="button-group">
          <button @click="onConfirmEdit">확인</button>
          <button @click="onClose">취소</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  text: String,
  show: Boolean,
});

const emits = defineEmits(['close', 'edit', 'delete']);

const mode = ref('view');
const editedText = ref(props.text);

watch(() => props.text, (newVal) => {
  editedText.value = newVal;
  mode.value = 'view';
});

const onClose = () => emits('close');
const onDelete = () => emits('delete');
const onConfirmEdit = () => emits('edit', editedText.value.trim());
</script>

<style scoped>
#popupOverlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
#popup {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 240px;
  min-height: 300px;
}
.text {
  margin-bottom: 1em;
  white-space: pre-wrap;
}
textarea {
  width: 100%;
  margin-bottom: 12px;
  font-size: 16px;
}
.button-group {
  margin-top: 30px; /* 버튼 전체 아래로 이동 */
}
.button-group button {
  display: block;
  width: 100%;
  margin: 14px 0; /* 버튼 간 간격 증가 */
  padding: 14px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
}
</style>