<template>
  <!-- 전체 페이지 래퍼 (Ionic 기본 구조) -->
  <ion-page>

    <!-- 상단 헤더 영역 (제목 없음 처리됨) -->
    <ion-header>
      <ion-toolbar>
        <ion-title> </ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- 페이지 콘텐츠 영역. scroll-y="false"로 고정 콘텐츠 레이아웃 구현 -->
    <ion-content scroll-y="false">
      <div class="container">
        
        <!-- ✅ 고정되는 상단 입력 영역 (입력 + 추가 버튼들) -->
        <div class="fixed-top">

          <!-- 입력창과 설정 버튼이 있는 상단 바 -->
          <div class="top-bar">
            <!-- 할 일 입력 텍스트박스 (v-model로 양방향 바인딩) -->
            <textarea 
              v-model="inputText" 
              placeholder="할 일을 입력하세요" 
              class="input-text" 
            />
            
            <!-- 설정 페이지로 이동하는 버튼 -->
            <button @click="goToSettings">⚙️ 설정</button>
          </div>

          <!-- 열 개수에 따라 동적으로 생성되는 추가 버튼들 -->
          <div class="add-row">
            
           <!-- 각 열마다 버튼 생성      --> 
            <!-- 해당 열에 할 일 추가  -->
            <button
            
              v-for="(col, index) in visibleColumns"    
              :key="index"
              class="add-btn"
              @click="addTodo(index)"                    
            >+추가</button>
          </div>
        </div>

        <!-- ✅ 스크롤 가능한 할 일 목록 영역 -->
        <div class="scroll-area">
          <div id="columns">
            <!-- 각 열 생성 -->
            <!-- 열 데이터 반복 렌더링 --> 
            <div
              v-for="(col, colIndex) in visibleColumns"  
              :key="colIndex"
              class="column"
              :data-index="colIndex"
            >
              <!-- 각 열 내부의 할 일들 출력 -->
              <!--  외형 스타일 적용  --> 
              <!-- 클릭 시 팝업 열기 -->  
              <div
                v-for="(todo, todoIndex) in col"
                :key="todoIndex"
                class="todo-btn"
                :style="todoBoxStyle"                    
                @click="showPopup(colIndex, todoIndex, todo)" 
              >
                <!-- 할 일 텍스트 표시 (스타일 적용) -->
                <span :style="todoStyle">{{ todo }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ 팝업 모달 (할 일 클릭 시 표시) -->
        <!--  모달 표시 여부-->
        <!--선택된 할 일 텍스트 전달  -->
        <!-- 닫기 이벤트 -->
        <!-- 수정 이벤트  -->
        <!--  삭제 이벤트-->
        <!--  -->
        <!--  -->

        <PopupModal
          v-if="popupOpen"             
          :text="popupText"            
          @close="onPopupClose"        
          @edit="handleEdit"           
          @delete="handleDelete"       
        />
      </div>
    </ion-content>
  </ion-page>
</template>




<script setup>
// Ionic 컴포넌트 및 Vue, Capacitor 관련 모듈 임포트
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue';

import Sortable from 'sortablejs'; // 드래그 앤 드롭 기능을 위한 라이브러리
import { useRouter } from 'vue-router';
import PopupModal from '@/components/modal/PopupModal.vue';

import { App } from '@capacitor/app';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import tinycolor from 'tinycolor2';

// Android 플랫폼에 필요한 권한 요청 함수들
const requestBatteryPermission = async () => {
  if (Capacitor.getPlatform() === 'android') {
    await window.Capacitor.Plugins.PermissionPlugin.requestBattery();
  }
};

const requestOverlayPermission = async () => {
  if (Capacitor.getPlatform() === 'android') {
    await window.Capacitor.Plugins.PermissionPlugin.requestOverlay();
  }
};

const router = useRouter(); // 라우터 인스턴스 생성

// 반응형 데이터 선언
const inputText = ref('');
const popupOpen = ref(false);
const popupText = ref('');
const selectedCol = ref(null);
const selectedIndex = ref(null);
const columns = ref([]);
const colCount = ref(1);

// 설정값 저장 및 불러오기
const settings = ref({ fontSize: 3, textAlign: 'center', buttonSize: 3, theme: 'light' });

// 설정 관련 로직
async function getColumnCount() {
  const { value } = await Preferences.get({ key: 'columnCount' });
  const count = parseInt(value, 10);
  return isNaN(count) ? 1 : count;
}

async function getTodos() {
  const { value } = await Preferences.get({ key: 'todoColumns' });
  return JSON.parse(value || '[]');
}

async function setTodos(data) {
  await Preferences.set({ key: 'todoColumns', value: JSON.stringify(data) });
}

async function getSettings() {
  const fontSize = parseInt((await Preferences.get({ key: 'fontSize' })).value || '3');
  const textAlign = (await Preferences.get({ key: 'textAlign' })).value || 'center';
  const buttonSize = parseInt((await Preferences.get({ key: 'buttonSize' })).value || '1');
  const theme = (await Preferences.get({ key: 'theme' })).value || 'light';
  return { fontSize, textAlign, buttonSize, theme };
}

function goToSettings() {
  router.push('/home/settings');
}

// 설정 페이지에서 돌아올 때 새로고침
router.afterEach((to, from) => {
  if (from.path === '/home/settings' && to.path === '/home') {
    render();
  }
});

function handleFocus() {
  render();
}

function showPopup(colIndex, todoIndex, text) {
  selectedCol.value = colIndex;
  selectedIndex.value = todoIndex;
  popupText.value = text;
  popupOpen.value = true;
}

// 팝업 내 편집 및 삭제 처리
async function handleEdit(newText) {
  const todos = await getTodos();
  todos[selectedCol.value][selectedIndex.value] = newText;
  await setTodos(todos);
  await render();
  popupOpen.value = false;
}

async function handleDelete() {
  const todos = await getTodos();
  todos[selectedCol.value].splice(selectedIndex.value, 1);
  await setTodos(todos);
  popupOpen.value = false;
  await render();
}

// 새 할 일 추가
async function addTodo(colIndex) {
  let value = inputText.value.trim();
  if (!value) value = '(비어 있음)';

  const todos = await getTodos();
  while (todos.length <= colIndex) todos.push([]);
  todos[colIndex].push(value);
  await setTodos(todos);
  inputText.value = '';
  await render();
}

// 설정 및 할 일 불러오기, 테마 적용 등
async function render() {
  const settingsData = await getSettings();
  colCount.value = await getColumnCount();
  settings.value = settingsData;
  await applyTheme(settingsData.theme);

  let data = await getTodos();
  while (data.length < 10) data.push([]);
  await setTodos(data);

  columns.value = data;

  setTimeout(() => initSortable(), 0); // DOM 업데이트 이후 드래그 초기화
}

// 현재 보이는 열만 계산
const visibleColumns = computed(() => {
  return columns.value.slice(0, colCount.value);
});

// 드래그 앤 드롭 적용
function initSortable() {
  const columnsEl = document.getElementById('columns');
  for (const col of columnsEl.children) {
    Sortable.create(col, {
      group: 'shared',
      animation: 150,
      ghostClass: 'dragging',
      fallbackOnBody: true,
      forceFallback: true,
      delay: 300,
      delayOnTouchOnly: true,
      touchStartThreshold: 5,
      onAdd: async (evt) => {
        const from = evt.from.dataset.index;
        const to = evt.to.dataset.index;
        const movedItem = evt.item.textContent;
        const todos = await getTodos();
        const index = todos[from].indexOf(movedItem);
        if (index > -1) todos[from].splice(index, 1);
        todos[to].splice(evt.newIndex, 0, movedItem);
        await setTodos(todos);
      },
      onUpdate: async () => {
        const newData = [];
        for (const col of columnsEl.children) {
          const items = Array.from(col.children).map((x) => x.textContent);
          newData.push(items);
        }
        const allTodos = await getTodos();
        for (let i = 0; i < newData.length; i++) {
          allTodos[i] = newData[i];
        }
        await setTodos(allTodos);
      },
    });
  }
}

// 안드로이드 백버튼 핸들러
function backHandler() {
  const path = router.currentRoute.value.path;
  if (popupOpen.value) {
    popupOpen.value = false;
  } else if (path !== '/home') {
    router.back();
  } else {
    App.exitApp();
  }
}

let backListener;

// 오버레이 권한 확인 및 요청
const checkAndRequestOverlayPermission = async () => {
  const hasOverlay = await checkOverlayPermission();
  if (!hasOverlay) {
    const confirm = window.confirm("📲 '다른 앱 위에 표시' 권한이 꺼져 있습니다.\n허용하시겠어요?");
    if (confirm) {
      await requestOverlayPermission();
    }
  }
};

// 초기 기본값 설정
async function initializePreferences() {
  const todos = await Preferences.get({ key: 'todoColumns' });
  if (!todos.value) {
    const defaultCols = Array.from({ length: 10 }, () => []);
    defaultCols[0].push('PlayToDo');
    await Preferences.set({ key: 'todoColumns', value: JSON.stringify(defaultCols) });
  }

  const col = await Preferences.get({ key: 'columnCount' });
  if (!col.value) {
    await Preferences.set({ key: 'columnCount', value: '3' });
  }

  const theme = await Preferences.get({ key: 'theme' });
  if (!theme.value) {
    await Preferences.set({ key: 'theme', value: 'dark' });
  }

  const fontSize = await Preferences.get({ key: 'fontSize' });
  if (!fontSize.value) {
    await Preferences.set({ key: 'fontSize', value: '3' });
  }
}

// 팝업 닫을 때 포커스 제거
function onPopupClose() {
  popupOpen.value = false;
  const active = document.activeElement;
  if (active instanceof HTMLElement && document.querySelector('.todo-btn')?.contains(active)) {
    active.blur();
  }
}

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  await initializePreferences();
  await render();
  settings.value = await getSettings();

  window.addEventListener('focus', handleFocus);
  backListener = await App.addListener('backButton', backHandler);

  if (Capacitor.getPlatform() === 'android') {
    await checkAndRequestOverlayPermission();
  }

  App.addListener('resume', async () => {
    const hasOverlay = await checkOverlayPermission();
    if (!hasOverlay) {
      alert('⚠️ 이 기능을 사용하려면 오버레이 권한이 필요합니다.');
    }
  });
});

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  backListener?.remove();
  window.removeEventListener('focus', handleFocus);
});

// 오버레이 권한 체크 함수
const checkOverlayPermission = async () => {
  const result = await window.Capacitor.Plugins.PermissionPlugin.hasOverlayPermission();
  return result.value;
};

// 할 일 항목의 글자 스타일 설정
const todoStyle = computed(() => {
  return {
    fontSize: `${0.3 + settings.value.fontSize * 0.2}rem`,
    textAlign: settings.value.textAlign,
  };
});

// 할 일 박스 스타일 설정
const todoBoxStyle = computed(() => {
  return {
    height: `${settings.value.buttonSize * 12 + 28}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    width: '100%',
  };
});

// 테마 적용 함수 (커스텀, 다크, 라이트)
async function applyTheme(theme) {
  const { value: color } = await Preferences.get({ key: 'customColor' });

  document.body.classList.remove('light', 'dark', 'custom-mode');

  if (theme === 'custom') {
    document.body.classList.add('custom-mode');
    const dark = tinycolor(color).darken(10).toHexString();
    const light = tinycolor(color).lighten(20).toHexString();
    document.documentElement.style.setProperty('--custom-bg', color);
    document.documentElement.style.setProperty('--ion-background-color', color);
    document.documentElement.style.setProperty('--custom-dark', dark);
    document.documentElement.style.setProperty('--custom-light', light);
  } else if (theme === 'light') {
    document.body.classList.add('light');
    document.documentElement.style.setProperty('--ion-background-color', '#ffffff');
    document.documentElement.style.setProperty('--ion-text-color', '#000000');
  } else if (theme === 'dark') {
    document.body.classList.add('dark');
    document.documentElement.style.setProperty('--ion-background-color', '#121212');
    document.documentElement.style.setProperty('--ion-text-color', '#ffffff');
  }
}
</script>






<style scoped lang="scss">
.fixed-top {
  padding: 16px;
  background: var(--ion-background-color);
  z-index: 1;
}

.input-text {
  font-size: 1rem;
  padding: 0.6em;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  min-height: 44px;
  background-color: #2a2a2a;
  color: white;
}

body.light .input-text,
body.custom-mode .input-text {
  background-color: #ffffff;
  color: #000000;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 16px 100px;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: var(--ion-background-color);
}

.top-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-bottom: 10px;
}
.top-bar button {
  font-size: 1rem;
  padding: 0.6em 1em;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.add-btn {
  flex: 1;
  font-size: 0.8rem;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid;
  color: black;
  border-color: black;
}
body.dark .add-btn {
  color: white;
  border-color: white;
}

#columns {
  display: flex;
  gap: 8px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}


/*
.todo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 6px;
  cursor: grab;
  white-space: pre-wrap;
  overflow: hidden;
  user-select: none;
  touch-action: auto;
  color: black;
  border-color: black;
  white-space: nowrap; // ✅ 줄바꿈 방지 
  overflow: hidden; // ✅ 넘치는 텍스트 숨김
  text-overflow: ellipsis; // ✅ 말줄임표
  width: 100%; // ✅ +추가 버튼과 동일한 너비 유지
  box-sizing: border-box;
  
}
*/

.todo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
  touch-action: auto;
  box-sizing: border-box;

  /* 스타일 조정 */
  color: black;
  border-color: black;

  /* 텍스트 오버플로우 방지 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* ✅ 가로 크기 고정 */
  max-width: 100%;
  min-width: 0;
  width: 100%; // 부모의 제한을 받게 설정
}




body.dark .todo-btn {
  color: white;
  border-color: white;
}

.dragging {
  background-color: #888 !important;
  opacity: 0.5;
  transform: scale(0.95);
}
</style>
