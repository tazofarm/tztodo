<template>
  <!-- 설정 페이지 전체를 감싸는 페이지 컴포넌트 -->
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title> </ion-title> <!-- 설정 페이지 제목 -->
      </ion-toolbar>
    </ion-header>

    <!-- 전체 콘텐츠 영역 -->
    <ion-content :fullscreen="true">
      <div class="container">
        ⚙️ 설정

        <!-- 테마 설정 영역 -->
        <div class="setting-section">
          <label>※ 배경 설정 </label>
          <div class="vertical-radio">
            <!-- 라이트/다크 모드 라디오 버튼 -->
            <div class="mode-row">
              <label><input type="radio" value="light" v-model="theme" /> 라이트모드</label>
              <label><input type="radio" value="dark" v-model="theme" /> 다크모드</label>
            </div>

            <!-- 커스텀 색상 선택 -->
            <div class="color-label-row">
              <label>
                <input type="radio" value="custom" v-model="theme" /> 색상 선택
              </label>
              <!-- 현재 선택된 색을 보여주는 박스 -->
              <span
                class="inline-color-box"
                :style="{
                  backgroundColor: customColor,
                  opacity: theme === 'custom' ? 1 : 0.4,
                  cursor: theme === 'custom' ? 'pointer' : 'default'
                }"
                @click="theme === 'custom' && (showPalette = true)"
              ></span>
            </div>
          </div>
        </div>

        <!-- 배열 수 설정 -->
        <div class="setting-section">
          <label>※ 배열 수</label>
          <div class="radio-group">
            <!-- 1~8열 선택 -->
            <div class="radio-row">
              <label><input type="radio" value="1" v-model="columnCount" /> 1열</label>
              <label><input type="radio" value="2" v-model="columnCount" /> 2열</label>
              <label><input type="radio" value="3" v-model="columnCount" /> 3열</label>
              <label><input type="radio" value="4" v-model="columnCount" /> 4열</label>
            </div>
            <div class="radio-row">
              <label><input type="radio" value="5" v-model="columnCount" /> 5열</label>
              <label><input type="radio" value="6" v-model="columnCount" /> 6열</label>
              <label><input type="radio" value="7" v-model="columnCount" /> 7열</label>
              <label><input type="radio" value="8" v-model="columnCount" /> 8열</label>
           </div>
          </div>
        </div>

        <!-- 글자 크기 설정 -->
        <div class="setting-section">
          <label>※ 글자 크기</label>
          <div class="radio-group">
            <div class="radio-row">
              <label><input type="radio" value="1" v-model="fontSize" /> 1</label>
              <label><input type="radio" value="2" v-model="fontSize" /> 2</label>
              <label><input type="radio" value="3" v-model="fontSize" /> 3</label>
              <label><input type="radio" value="4" v-model="fontSize" /> 4</label>
              <label><input type="radio" value="5" v-model="fontSize" /> 5</label>
            </div>
          </div>
        </div>

        <!-- 버튼 크기 설정 -->
        <div class="setting-section">
          <label>※ 버튼 크기</label>
          <div class="radio-group">
            <label><input type="radio" value="1" v-model="buttonSize" /> 1</label>
            <label><input type="radio" value="2" v-model="buttonSize" /> 2</label>
            <label><input type="radio" value="3" v-model="buttonSize" /> 3</label>
            <label><input type="radio" value="4" v-model="buttonSize" /> 4</label>
            <label><input type="radio" value="5" v-model="buttonSize" /> 5</label>
          </div>
        </div>

        <!-- 설정 저장 버튼 -->
        <div style="margin-top: 20px;">
          <ion-button expand="block" @click="saveSettings" :style="buttonStyle">적용</ion-button>
        </div>
      </div>

      <!-- 색상 선택 팝업 모달 -->
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
    </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
// Ionic 컴포넌트 및 Vue 기본 기능 import
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
import { Preferences } from '@capacitor/preferences';
import { useRouter } from 'vue-router';

// 라우터 인스턴스 생성
const router = useRouter();

// 사용자 설정값 상태 (ref로 반응형 선언)
const theme = ref('light');            // 테마 설정: light / dark / custom
const columnCount = ref('3');          // 열 개수: 1~8
const fontSize = ref('1');             // 글자 크기 단계: 1~5
const buttonSize = ref('1');           // 버튼 크기 단계: 1~5
const customColor = ref('#fce4ec');    // 커스텀 테마 색상
const showPalette = ref(false);        // 색상 선택 모달 표시 여부
const showTopBar = ref('on');          // 상단바 표시 여부 (현재 사용되지 않음)

// 색상 선택용 색상표 배열
const colorGrid = [
  ['#fce4ec', '#f8bbd0', '#ffe0b2', '#fff9c4', '#e1bee7', '#b3e5fc'],
  ['#e91e63', '#ff5722', '#ffeb3b', '#8bc34a', '#00bcd4', '#3f51b5'],
  ['#880e4f', '#bf360c', '#f57f17', '#33691e', '#006064', '#1a237e']
];

// 색상 선택 시 값 저장 및 모달 닫기
function selectColor(color: string) {
  customColor.value = color;
  showPalette.value = false;
}

// 팔레트가 닫힐 때 포커스 해제 처리 (버그 방지용)
function onPaletteClosed() {
  showPalette.value = false;
  const active = document.activeElement as HTMLElement;
  if (active && document.querySelector('.custom-modal')?.contains(active)) {
    active.blur();
  }
}

// 설정 값 초기화 (없으면 기본값 저장 후 반환)
async function initSetting(key: string, defaultValue: string): Promise<string> {
  const { value } = await Preferences.get({ key });
  if (value === null) {
    await Preferences.set({ key, value: defaultValue });
    return defaultValue;
  }
  return value;
}

// 페이지 마운트 시 초기 설정값 불러오기
onMounted(async () => {
  theme.value = await initSetting('theme', 'dark');
  columnCount.value = await initSetting('columnCount', '3');
  fontSize.value = await initSetting('fontSize', '3');
  buttonSize.value = await initSetting('buttonSize', '1');
  customColor.value = await initSetting('customColor', '#fce4ec');
  showTopBar.value = await initSetting('showTopBar', 'on');
});

// 설정 저장 후 홈으로 이동
async function saveSettings() {
  await Preferences.set({ key: 'theme', value: theme.value });
  await Preferences.set({ key: 'columnCount', value: columnCount.value });
  await Preferences.set({ key: 'fontSize', value: fontSize.value });
  await Preferences.set({ key: 'buttonSize', value: buttonSize.value });
  await Preferences.set({ key: 'showTopBar', value: showTopBar.value });
  if (theme.value === 'custom') {
    await Preferences.set({ key: 'customColor', value: customColor.value });
  }
  router.push('/home');
}

// 적용 버튼의 스타일 (테마에 따라 동적으로 결정)
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

// 밝기 대비로 텍스트 색상 자동 선택 (흰/검 텍스트)
function getContrastYIQ(hexcolor: string) {
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}
</script>

<style scoped>
/* 메인 컨테이너 스타일 */
.container {
  padding: 16px;
  padding-bottom: calc(var(--ad-height, 60px) + 60px); /* 하단 여백 확보 */
  height: 100%;
  overflow-y: auto; /* 세로 스크롤 가능 */
}

/* 라디오 버튼 그룹 스타일 */
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

/* 설정 섹션 박스 스타일 */
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

/* 수직 정렬된 라디오 버튼과 일반 라벨 */
.vertical-radio label,
.radio-group label {
  color: #000;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 모드/색상 선택 행 스타일 */
.vertical-radio .mode-row,
.vertical-radio .color-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

/* 색상 선택 박스 스타일 */
.inline-color-box {
  width: 28px;
  height: 28px;
  border: 2px solid #666;
  border-radius: 4px;
  cursor: pointer;
}

/* 색상 선택 그리드 */
.color-grid {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

/* 각 색상 행 */
.color-row {
  display: flex;
  gap: 10px;
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

/* 선택된 색상 버튼 강조 */
.color-row button.selected {
  border: 2px solid #000;
}

/* 모달 내 컨텐츠 스타일 */
.modal-content {
  padding: 16px;
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
}

/* IonModal 스타일 커스터마이징 */
ion-modal.custom-modal {
  --width: fit-content;
  --height: fit-content;
  --max-width: 320px;
  --max-height: 360px;
  --border-radius: 12px;
  --background: transparent;
}

/* 라디오 버튼 행 */
.radio-row {
  display: flex;
  gap: 10px;
  margin-bottom: 1px;
}
</style>
