<template>
  <div class="setting-section">
    <label>※ 상단바 노출</label>

    <div class="topbar-toggle-row">
      <!-- 상단바 On/Off 스위치 -->
      <ion-toggle
        v-model="localShowTopBar"
        @ionChange="onToggleChange"
        :checked="localShowTopBar"
        :aria-label="'상단바 노출 스위치'"
      />

      <!-- 스위치 상태 표시 텍스트 -->
      <span class="switch-state-text">
        {{ localShowTopBar ? 'ON' : 'OFF' }}
      </span>


      <!-- 남은 시간 및 연장하기 버튼 -->
      <span class="remaining-time">
        남은시간 {{ remainingDays }}일 {{ remainingTime }}
      </span>
      <ion-button
        size="small"
        @click="handleRewardClick"
        :disabled="remainingDays === 8"
        style="margin-left:8px;"
      > 
      <div class="extend-text">
      <span>연장하기</span>
      <span>(광고)</span>
      </div>
      </ion-button>
    </div>
    
  </div>
  
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { IonToggle, IonButton } from '@ionic/vue';
import { defineModel, defineEmits } from 'vue';

// === 상태/이벤트 ===
const emit = defineEmits(['request-reward-ad']);
const modelTopbar = defineModel<boolean>('showTopBar'); // 부모와 양방향
const localShowTopBar = ref(false);

// 남은 시간 (일/시간:분), 기본값 8일 00:00
const remainingDays = ref<number>(8);
const remainingTime = ref<string>('00:00');

// -- 앱 실행 시 조건: 상단바 on && 남은 시간 0이면 광고 자동실행 및 리셋
onMounted(() => {
  if (localShowTopBar.value && remainingDays.value === 0) {
    requestRewardAdAndReset();
  }
});

// --- modelTopbar (부모와 동기화) ---
watch(modelTopbar, (val) => {
  localShowTopBar.value = !!val;
});
watch(localShowTopBar, (val) => {
  modelTopbar.value = val;
});

// --- 스위치 on/off 변경 ---
function onToggleChange() {
  // ON으로 켤 때 남은시간 0이면 광고!
  if (localShowTopBar.value && remainingDays.value === 0) {
    requestRewardAdAndReset();
  }
  // OFF로 바꿨을 때는 아무것도 안함
}

// --- 연장하기(광고) 버튼 ---
function handleRewardClick() {
  requestRewardAdAndReset();
}

// --- 광고 재생 + 시간 리셋 ---
function requestRewardAdAndReset() {
  emit('request-reward-ad');
  remainingDays.value = 8;
  remainingTime.value = '00:00';
}

// --- 예시: 남은 시간이 줄어드는 로직 (실제 앱에서는 타이머/날짜 계산 필요)
function decreaseDay() {
  if (remainingDays.value > 0) remainingDays.value--;
  if (remainingDays.value < 0) remainingDays.value = 0;
}

// 실제 앱에서는 아래와 같이 타이머로 구현할 수 있습니다.
// setInterval(decreaseDay, 24 * 60 * 60 * 1000); // 하루마다 줄어듦
</script>

<style scoped>
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

.topbar-toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.remaining-time {
  font-size: 0.95rem;
  color: #333;
  white-space: nowrap;
}

.switch-state-text {
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 28px;
  text-align: center;
  color: #444;
}

.extend-button {
  height: 60px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.extend-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
  font-size: 0.75rem;
}
</style>