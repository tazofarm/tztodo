<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>To-Do</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <div class="container">
        <div class="top-bar">
          <textarea v-model="inputText" placeholder="할 일을 입력하세요" />
          <button @click="goToSettings">⚙️ 설정</button>
        </div>

        <div class="add-row">
          <button
            v-for="(col, index) in columns"
            :key="index"
            @click="addTodo(index)"
          >+추가</button>
        </div>

        <div id="columns">
          <div
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            class="column"
            :data-index="colIndex"
          >
          <div
            v-for="(todo, todoIndex) in col"
            :key="todoIndex"
            class="todo-btn"
            :style="todoBoxStyle"
            @click="showPopup(colIndex, todoIndex, todo)"
            >
            <span :style="todoStyle">{{ todo }}</span>
          </div>
        </div>
      </div>

      <PopupModal
        v-if="popupOpen"
        :text="popupText"
        @close="popupOpen = false"
        @edit="handleEdit"
        @delete="handleDelete"
      />

        <div id="admob-placeholder">광고 영역</div>
      </div>


      <div class="permission-buttons">
        <button @click="requestBatteryPermission">🔋 배터리 최적화 제외</button>
        <button @click="requestOverlayPermission">📲 다른 앱 위에 표시</button>
      </div>


    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue';


import Sortable from 'sortablejs';
import { useRouter } from 'vue-router';
import PopupModal from '@/components/PopupModal.vue';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted, ref, computed } from 'vue'; // ref도 여기 있음


import { Capacitor } from '@capacitor/core';

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


const router = useRouter();

const inputText = ref('');
const popupOpen = ref(false);
const popupText = ref('');
const selectedCol = ref(null);
const selectedIndex = ref(null);
const columns = ref([]);










// -------- 로컬스토리지 유틸 --------
function getColumnCount() {
  return parseInt(localStorage.getItem('columnCount') || '1');
}

function getTodos() {
  return JSON.parse(localStorage.getItem('todoColumns') || '[]');
}

function setTodos(data) {
  localStorage.setItem('todoColumns', JSON.stringify(data));
}

function getSettings() {
  return {
    fontSize: parseInt(localStorage.getItem('fontSize') || '3'),
    textAlign: localStorage.getItem('textAlign') || 'center',
    buttonSize: parseInt(localStorage.getItem('buttonSize') || '3'),
    theme: localStorage.getItem('theme') || 'light',
  };
}


function goToSettings() {
  router.push('/setting');
}

function showPopup(colIndex, todoIndex, text) {
  selectedCol.value = colIndex;
  selectedIndex.value = todoIndex;
  popupText.value = text;
  popupOpen.value = true;
}

function handleEdit(newText) {
  const todos = getTodos();
  todos[selectedCol.value][selectedIndex.value] = newText;
  setTodos(todos);
  popupOpen.value = false;
  render();
}

function handleDelete() {
  const todos = getTodos();
  todos[selectedCol.value].splice(selectedIndex.value, 1);
  setTodos(todos);
  popupOpen.value = false;
  render();
}

function addTodo(colIndex) {
  let value = inputText.value.trim();
  if (!value) value = '(비어 있음)';

  const todos = [...columns.value]; // ✅ 화면상 최신 정렬 상태 사용
  todos[colIndex].push(value);
  setTodos(todos); // ✅ 이 상태를 저장
  inputText.value = '';
  render();
}

function render() {
  const colCount = getColumnCount();
  const settings = getSettings();
  applyTheme(settings.theme);

  let data = getTodos();

  // 부족한 열은 추가
  while (data.length < colCount) data.push([]);

  setTodos(data);

  // ✅ 필요한 수 만큼만 보여주기 (전체는 보존)
  columns.value = data.slice(0, colCount);

  setTimeout(() => initSortable(), 0);
}

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
      onAdd(evt) {
        const from = evt.from.dataset.index;
        const to = evt.to.dataset.index;
        const movedItem = evt.item.textContent;
        const todos = getTodos();
        const index = todos[from].indexOf(movedItem);
        if (index > -1) todos[from].splice(index, 1);
        todos[to].splice(evt.newIndex, 0, movedItem);
        setTodos(todos);
      },
      onUpdate() {
        const newData = [];
        for (const col of columnsEl.children) {
          const items = Array.from(col.children).map((x) => x.textContent);
          newData.push(items);
        }
        setTodos(newData);
      },
    });
  }
}

function backHandler() {
  const path = router.currentRoute.value.path;
  console.log('Current path:', path);

  if (popupOpen.value) {
    popupOpen.value = false;
  } else if (path !== '/home') {
    router.back();
  } else {
    App.exitApp();
  }
}





let backListener;

const checkAndRequestOverlayPermission = async () => {
  const hasOverlay = await checkOverlayPermission();
  if (!hasOverlay) {
    const confirm = window.confirm("📲 '다른 앱 위에 표시' 권한이 꺼져 있습니다.\n허용하시겠어요?");
    if (confirm) {
      await requestOverlayPermission();
    }
  }
};

onMounted(async () => {
  if (!localStorage.getItem('todoColumns')) {
    localStorage.setItem('todoColumns', JSON.stringify([['안녕하세요']])); 
  }
  if (!localStorage.getItem('columnCount')) {
    localStorage.setItem('columnCount', '1');
  }

  render();
  window.addEventListener('focus', render);
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


const checkOverlayPermission = async () => {
  const result = await window.Capacitor.Plugins.PermissionPlugin.hasOverlayPermission();
  return result.value;
};







onUnmounted(() => {
  backListener?.remove();
});

// -------- 동적 스타일 --------
const settings = getSettings();
const fontSizeRem = 0.8 + settings.fontSize * 0.2;
const buttonHeight = settings.buttonSize * 12 + 28 + 'px';


const todoStyle = computed(() => {
  const settings = getSettings();
  const fontSizeRem = 0.8 + settings.fontSize * 0.2;
  return {
    fontSize: fontSizeRem + 'rem',
    textAlign: settings.textAlign,
  };
});

const todoBoxStyle = computed(() => {
  const settings = getSettings();
  return {
    height: `${settings.buttonSize * 12 + 28}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px',
    width: '100%',
  };
});




import tinycolor from 'tinycolor2';

function applyTheme(theme) {
  const color = localStorage.getItem('customColor') || '#fce4ec';
  document.body.classList.remove('light-mode', 'dark-mode', 'custom-mode');

  if (theme === 'custom') {
    document.body.classList.add('custom-mode');
    const dark = tinycolor(color).darken(10).toHexString();
    const light = tinycolor(color).lighten(20).toHexString();
    document.documentElement.style.setProperty('--custom-bg', color);
    document.documentElement.style.setProperty('--custom-dark', dark);
    document.documentElement.style.setProperty('--custom-light', light);
  } else {
    document.body.classList.add(`${theme}-mode`);
  }
}


</script>











<!-- 👇 컴포넌트 전용 스타일 -->
<style scoped>

.permission-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.permission-buttons button {
  flex: 1;
  font-size: 0.9rem;
  padding: 0.5em;
  border-radius: 6px;
  border: 1px solid #aaa;
  background-color: #f0f0f0;
}

.container {
  padding: 16px;
  height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
.top-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-bottom: 10px;
}
.top-bar textarea {
  font-size: 1rem;
  padding: 0.6em;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  min-height: 44px;
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
}

.dragging {
  background-color: #888 !important;
  opacity: 0.5;
  transform: scale(0.95);
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

<!-- 크로스 스타일 -->
<style>
:root {
  --light-bg: #ffffff;
  --dark-bg: #121212;
  --light-text: #000000;
  --dark-text: #ffffff;
  --custom-bg: #fce4ec;
  --custom-dark: #e91e63;
  --custom-light: #f8bbd0;
}

body.light-mode {
  background-color: var(--light-bg);
  color: var(--light-text);
}

body.dark-mode {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}

body.light-mode .top-bar textarea {
  background-color: #ffffff;
  color: #000000;
}
body.dark-mode .top-bar textarea {
  background-color: #2a2a2a;
  color: #ffffff;
}

body.light-mode .top-bar button {
  background-color: #e0e0e0;
  color: #000000;
}
body.dark-mode .top-bar button {
  background-color: #444444;
  color: #ffffff;
}

body.light-mode .container,
body.light-mode .todo-btn,
body.light-mode .top-bar {
  background-color: #f5f5f5;
  color: black;
}

body.dark-mode .container,
body.dark-mode .todo-btn,
body.dark-mode .top-bar {
  background-color: #1e1e1e;
  color: white;
}

.add-row button {
  flex: 1;
  font-size: 1rem;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

body.light-mode .add-row button {
  background-color: #e0e0e0;
  color: #000000;
  border: 2px solid #999999;
}

body.dark-mode .add-row button {
  background-color: #333333;
  color: #ffffff;
  border: 2px solid #888888;
}

ion-toolbar {
  padding-top: env(safe-area-inset-top, 24px);
}

ion-header ion-toolbar {
  padding-top: env(safe-area-inset-top, 20px);
  min-height: 64px;
  box-sizing: border-box;
}

ion-title {
  text-align: center;
  margin-top: 4px;
}

body.custom-mode {
  background-color: var(--custom-bg);
  color: black;
}
body.custom-mode .container,
body.custom-mode .top-bar {
  background-color: var(--custom-bg);
  color: black;
}
body.custom-mode .top-bar textarea {
  background-color: var(--custom-light);
  color: black;
}
body.custom-mode .top-bar button {
  background-color: var(--custom-dark);
  color: black;
}
body.custom-mode .add-row button {
  background-color: var(--custom-dark);
  color: black;
  border: 2px solid var(--custom-dark);
}
body.custom-mode .todo-btn {
  background-color: var(--custom-light);
  color: black;
  border: 1px solid var(--custom-dark);
}
</style>