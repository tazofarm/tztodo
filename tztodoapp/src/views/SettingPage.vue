<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>⚙️ 설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="container">
        <!-- 테마 설정 -->
        <div class="setting-section">
          <label>배경 설정</label>
          <div class="vertical-radio">
            <div class="mode-row">
              <label><input type="radio" value="light" v-model="theme" /> 라이트모드</label>
              <label><input type="radio" value="dark" v-model="theme" /> 다크모드</label>
            </div>
            <div class="color-label-row">
  <label>
    <input type="radio" value="custom" v-model="theme" /> 색상 선택
  </label>
  <span
    class="inline-color-box"
    :style="{ backgroundColor: customColor, opacity: theme === 'custom' ? 1 : 0.4, cursor: theme === 'custom' ? 'pointer' : 'default' }"
    @click="theme === 'custom' && (showPalette = true)"
  ></span>
</div>
          </div>
        </div>

        <!-- 나머지 설정 섹션들 -->
        <div class="setting-section">
          <label>배열 수</label>
          <div class="radio-group">
            <label><input type="radio" value="1" v-model="columnCount" /> 1열</label>
            <label><input type="radio" value="2" v-model="columnCount" /> 2열</label>
            <label><input type="radio" value="3" v-model="columnCount" /> 3열</label>
          </div>
        </div>

        <div class="setting-section">
          <label>글자 크기</label>
          <div class="radio-group">
            <label><input type="radio" value="1" v-model="fontSize" /> 1</label>
            <label><input type="radio" value="2" v-model="fontSize" /> 2</label>
            <label><input type="radio" value="3" v-model="fontSize" /> 3</label>
            <label><input type="radio" value="4" v-model="fontSize" /> 4</label>
            <label><input type="radio" value="5" v-model="fontSize" /> 5</label>
          </div>
        </div>

        <div class="setting-section">
          <label>버튼 크기</label>
          <div class="radio-group">
            <label><input type="radio" value="1" v-model="buttonSize" /> 1</label>
            <label><input type="radio" value="2" v-model="buttonSize" /> 2</label>
            <label><input type="radio" value="3" v-model="buttonSize" /> 3</label>
            <label><input type="radio" value="4" v-model="buttonSize" /> 4</label>
            <label><input type="radio" value="5" v-model="buttonSize" /> 5</label>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <ion-button expand="block" @click="saveSettings" :style="buttonStyle">적용</ion-button>
        </div>
      </div>

      <!-- 색상 선택 모달 -->
      <ion-modal :is-open="showPalette" @did-dismiss="showPalette = false" class="custom-modal">
        <div class="modal-content">
          <h3>색상 선택</h3>
          <div class="color-grid">
            <div v-for="(row, rowIndex) in colorGrid" :key="rowIndex" class="color-row">
              <button
                v-for="color in row"
                :key="color"
                :style="{ backgroundColor: color }"
                @click="selectColor(color)"
                :class="{ selected: customColor === color }"
              />
            </div>
          </div>
        </div>
      </ion-modal>
            <!-- 하단 광고 영역 -->
      <div id="admob-placeholder">광고 영역</div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonModal,
} from '@ionic/vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const theme = ref('light');
const columnCount = ref('3');
const fontSize = ref('2');
const buttonSize = ref('3');
const customColor = ref('#fce4ec');
const showPalette = ref(false);

const colorGrid = [
  ['#fce4ec', '#f8bbd0', '#ffe0b2', '#fff9c4', '#e1bee7', '#b3e5fc'],
  ['#e91e63', '#ff5722', '#ffeb3b', '#8bc34a', '#00bcd4', '#3f51b5'],
  ['#880e4f', '#bf360c', '#f57f17', '#33691e', '#006064', '#1a237e']
];

function togglePalette() {
  showPalette.value = !showPalette.value;
}

function selectColor(color: string) {
  customColor.value = color;
  showPalette.value = false;
}

function initSetting(key: string, defaultValue: string) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, defaultValue);
  }
  return localStorage.getItem(key) as string;
}

onMounted(() => {
  theme.value = initSetting('theme', 'light');
  columnCount.value = initSetting('columnCount', '3');
  fontSize.value = initSetting('fontSize', '2');
  buttonSize.value = initSetting('buttonSize', '3');
  customColor.value = initSetting('customColor', '#fce4ec');
});

function saveSettings() {
  localStorage.setItem('theme', theme.value);
  localStorage.setItem('columnCount', columnCount.value);
  localStorage.setItem('fontSize', fontSize.value);
  localStorage.setItem('buttonSize', buttonSize.value);
  if (theme.value === 'custom') {
    localStorage.setItem('customColor', customColor.value);
  }
  window.location.href = '/home';
}

const buttonStyle = computed(() => {
  if (theme.value === 'custom') {
    return {
      '--background': customColor.value,
      '--color': getContrastYIQ(customColor.value),
    };
  } else if (theme.value === 'dark') {
    return {
      '--background': '#333333',
      '--color': '#ffffff',
    };
  } else {
    return {
      '--background': '#cccccc',
      '--color': '#000000',
    };
  }
});

function getContrastYIQ(hexcolor: string) {
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}
</script>

<style scoped>
html,
body,
ion-content {
  height: 100%;
  overflow: hidden;
}

.container {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 80px; /* 적용 버튼과 광고영역 고려 */
}

.radio-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.radio-group label {
  white-space: nowrap;
  color: #000;
}

.setting-section {
  background-color: #e0e0e0;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
}

.setting-section label:first-child {
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 4px;
  color: #000;
}

.vertical-radio label,
.radio-group label {
  color: #000; /* 항상 검정 글자 */
}

.radio-group label,
.vertical-radio label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #000 !important;
  font-weight: bold;
}

.vertical-radio .mode-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px; /* 기존 간격 */
}

.vertical-radio .color-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px; /* 더 촘촘한 간격으로 줄임 */
}

.inline-color-box {
  width: 28px;
  height: 28px;
  border: 2px solid #666;
  border-radius: 4px;
  cursor: pointer;
}

.color-grid {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.color-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.color-row button {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid #ccc;
  cursor: pointer;
}

.color-row button.selected {
  border: 2px solid #000;
}

.modal-content {
  padding: 16px;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
}

ion-modal.custom-modal {
  --width: fit-content;
  --height: fit-content;
  --max-width: 320px;
  --max-height: 360px;
  --border-radius: 12px;
  --background: transparent;
}

#admob-placeholder {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 10;
}
</style>


