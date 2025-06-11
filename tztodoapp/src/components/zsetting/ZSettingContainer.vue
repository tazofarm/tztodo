<template>
  <!-- 설정 화면 컨테이너 -->
  <div class="screen-wrapper">
    <!-- 제목 -->
    <h2>⚙️ 설정</h2>

    <div class="scroll-section">
      <!-- 테마 설정 컴포넌트: 라이트/다크/커스텀 + 커스텀 색상 -->
      <ZSettingTheme v-model:theme="theme" v-model:customColor="customColor" @show-palette="showPalette = true" />

      <!-- 컬럼 수 설정 (1~8열) -->
      <ZSettingColumn v-model="columnCount" />

      <!-- 폰트 크기 설정 -->
      <ZSettingFont v-model="fontSize" />

      <!-- 버튼 크기 설정 -->
      <ZSettingButton v-model="buttonSize" />

      <!-- 커스텀 색상 팔레트 모달 (조건부 렌더링) -->
      <ZColorPaletteModal :is-open="showPalette" v-model:color="customColor" @close="showPalette = false" />

      <!-- 상단바 허용-->
      <ZSettingTopbar v-model:showTopBar="showTopBar" @request-reward-ad="handleRewardAd" />
    </div>


    
    <!-- 고정 영역: 적용 버튼 -->
    <div class="fixed-bottom">
      <!-- 설정 저장 버튼 -->
      <ion-button expand="block" @click="saveSettings" :style="buttonStyle">적용</ion-button>
    </div>  
  </div>
</template>







<script setup lang="ts">
// 기본 vue 기능과 Capacitor Preferences, 라우터, Ionic 컴포넌트 불러오기
import { ref, computed, onMounted } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { useRouter } from 'vue-router';
import { IonButton } from '@ionic/vue';

// 하위 설정 컴포넌트 불러오기
import ZSettingTheme from './ZSettingTheme.vue';
import ZSettingColumn from './ZSettingColumn.vue';
import ZSettingFont from './ZSettingFont.vue';
import ZSettingButton from './ZSettingButton.vue';
import ZColorPaletteModal from './ZColorPaletteModal.vue'; 
import ZSettingTopbar from './ZSettingTopbar.vue'; 

// AdMob 플러그인 추가
import { AdMob } from '@capacitor-community/admob';

// 라우터 인스턴스 생성
const router = useRouter();

// 사용자 설정값들 선언 (ref로 상태 관리)
const theme = ref('light'); // 테마
const columnCount = ref('3'); // 컬럼 수
const fontSize = ref('1'); // 글자 크기
const buttonSize = ref('1'); // 버튼 크기
const customColor = ref('#fce4ec'); // 커스텀 색상
const showPalette = ref(false); // 색상 선택 모달 표시 여부
const showTopBar = ref(true); // 상단 바 표시 여부

// 컴포넌트 마운트 시 설정값 초기화
onMounted(async () => {
  theme.value = await initSetting('theme', 'dark');
  columnCount.value = await initSetting('columnCount', '3');
  fontSize.value = await initSetting('fontSize', '3');
  buttonSize.value = await initSetting('buttonSize', '1');
  customColor.value = await initSetting('customColor', '#fce4ec');
  showTopBar.value = (await initSetting('showTopBar', 'on')) === 'on';
});

// 로컬 스토리지에서 값 가져오고 없으면 기본값으로 초기화하는 함수
async function initSetting(key: string, defaultValue: string): Promise<string> {
  const { value } = await Preferences.get({ key });
  if (value === null) {
    await Preferences.set({ key, value: defaultValue });
    return defaultValue;
  }
  return value;
}

// 설정값 저장 함수
async function saveSettings() {
  await Preferences.set({ key: 'theme', value: theme.value });
  await Preferences.set({ key: 'columnCount', value: columnCount.value });
  await Preferences.set({ key: 'fontSize', value: fontSize.value });
  await Preferences.set({ key: 'buttonSize', value: buttonSize.value });
  await Preferences.set({ key: 'showTopBar', value: showTopBar.value ? 'on' : 'off' });
  // 커스텀 테마일 경우 색상 저장
  if (theme.value === 'custom') {
    await Preferences.set({ key: 'customColor', value: customColor.value });
  }
  // 홈 화면으로 이동
  router.push('/home');
}

// 적용 버튼 스타일 동적 계산
const buttonStyle = computed(() => {
  if (theme.value === 'custom') {
    return {
      '--background': customColor.value, // 사용자 색상 배경
      '--color': getContrastYIQ(customColor.value), // 가독성 고려한 텍스트 색상
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

// 텍스트 대비 색상 자동 계산 함수 (YIQ 알고리즘 기반)
function getContrastYIQ(hexcolor: string) {
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

// 보상형 광고 실행 로직
async function handleRewardAd() {
  console.log('보상 광고 실행');

  try {
    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-3940256099942544/5224354917', // ✅ 테스트용 광고 ID
      isTesting: true,
    });

    await AdMob.showRewardVideoAd();
    console.log('보상 광고 완료');
  } catch (error) {
    console.error('광고 로딩 실패:', error);
  }
}








</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.screen-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding: 0px 16px 10px 16px; /* top right bottom left */
}

.fixed-bottom {
  padding: 16px;
  padding-bottom: calc(var(--ad-height, 60px));
  background: #000; /* 필요 시 배경 지정 */
}

</style>