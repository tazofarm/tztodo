<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title> </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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
import AdBanner from '@/components/AdBanner.vue';
import { App } from '@capacitor/app';
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { Preferences } from '@capacitor/preferences';
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
const columns = ref([[], [], []]);

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
  router.push('/setting');
}

function showPopup(colIndex, todoIndex, text) {
  selectedCol.value = colIndex;
  selectedIndex.value = todoIndex;
  popupText.value = text;
  popupOpen.value = true;
}

async function handleEdit(newText) {
  const updated = [...columns.value];
  updated[selectedCol.value][selectedIndex.value] = newText;

  await setTodos(updated);
  columns.value = updated;
  popupOpen.value = false;
}


async function handleDelete() {
  const todos = await getTodos();
  todos[selectedCol.value].splice(selectedIndex.value, 1);
  await setTodos(todos);
  popupOpen.value = false;
  await render();
}

async function addTodo(colIndex) {
  let value = inputText.value.trim();
  if (!value) value = '(비어 있음)';

  const todos = [...columns.value];
  todos[colIndex].push(value);
  await setTodos(todos);
  inputText.value = '';
  await render();
}

async function render() {
  const colCount = await getColumnCount();
  const settings = await getSettings();
  await applyTheme(settings.theme);

  let data = await getTodos();
  while (data.length < colCount) data.push([]);
  if (data.length > colCount) data = data.slice(0, colCount);

  await setTodos(data);
  columns.value = Array.from({ length: colCount }, (_, i) => data[i] || []);

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
        await setTodos(newData);
      },
    });
  }
}

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

const checkAndRequestOverlayPermission = async () => {
  const hasOverlay = await checkOverlayPermission();
  if (!hasOverlay) {
    const confirm = window.confirm("📲 '다른 앱 위에 표시' 권한이 꺼져 있습니다.\n허용하시겠어요?");
    if (confirm) {
      await requestOverlayPermission();
    }
  }
};

async function initializePreferences() {
  const todos = await Preferences.get({ key: 'todoColumns' });
  if (!todos.value) {
    const colCount = await getColumnCount();
    const defaultCols = Array.from({ length: colCount }, () => []);
    defaultCols[0].push('PlayToDo');
    await Preferences.set({ key: 'todoColumns', value: JSON.stringify(defaultCols) });
  }

  const col = await Preferences.get({ key: 'columnCount' });
  if (!col.value) {
    await Preferences.set({ key: 'columnCount', value: '3' }); // ✅ 변경: 기본 3열
  }

  const theme = await Preferences.get({ key: 'theme' });
  if (!theme.value) {
    await Preferences.set({ key: 'theme', value: 'dark' }); // ✅ 추가: 기본 다크모드
  }


  const fontSize = await Preferences.get({ key: 'fontSize' });
  if (!fontSize.value) {
    await Preferences.set({ key: 'fontSize', value: '3' }); // 기본 글자 크기 3
  }
}



onMounted(async () => {
  await initializePreferences();
  await render();
  settings.value = await getSettings();

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

onUnmounted(() => {
  backListener?.remove();
  window.removeEventListener('focus', render);
});

const checkOverlayPermission = async () => {
  const result = await window.Capacitor.Plugins.PermissionPlugin.hasOverlayPermission();
  return result.value;
};


const settings = ref({ fontSize: 3, textAlign: 'center', buttonSize: 3, theme: 'light' });



const todoStyle = computed(() => {
  return {
    fontSize: `${0.3 + settings.value.fontSize * 0.2}rem`,
    textAlign: settings.value.textAlign,
  };
});

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

import tinycolor from 'tinycolor2';

async function applyTheme(theme) {
  const { value: color } = await Preferences.get({ key: 'customColor' });
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
  height: calc(100vh - 60px); /* 광고 영역 여백 확보 */
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
  font-size: 0.8rem;
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