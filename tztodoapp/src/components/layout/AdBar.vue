<template>
  <!-- ✅ 광고가 차지할 공간 확보용 DIV -->
  <!-- 실제 광고는 네이티브(AdMob)에서 띄우기 때문에 여긴 높이만 확보합니다 -->
  <div class="ad-bar" :style="{ height: `${adHeight}px` }"></div>
</template>

<script setup lang="ts">
// ✅ Vue의 Composition API 관련 기능들
import { onMounted, onUnmounted, ref } from 'vue'

// ✅ Capacitor용 AdMob 플러그인에서 필요한 항목 불러오기
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdOptions,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob'

// ✅ 광고 높이 저장용 변수 (기본값: 60px)
const adHeight = ref(60)

onMounted(async () => {
  // ✅ AdMob 초기화 (필수)
  await AdMob.initialize()

  // ✅ 광고 옵션 설정
  const options: BannerAdOptions = {
    adId: 'ca-app-pub-3940256099942544/9214589741', // 적응형 테스트 ID
    adSize: BannerAdSize.ADAPTIVE_BANNER,                // ✅ 표준 배너 크기
    position: BannerAdPosition.BOTTOM_CENTER,      // ✅ 하단 중앙에 표시
    margin: 0,
    isTesting: true,                               // ✅ 테스트 모드 (출시 전에는 false로 변경)
  }

  // ✅ 배너 광고 표시 실행
  await AdMob.showBanner(options)

  // ✅ 광고 크기 변경 감지 후 높이 업데이트
  // 기기에 따라 높이가 달라질 수 있어서 반영 필요
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    if (size?.height) {
      adHeight.value = size.height
    }
  })
})

onUnmounted(() => {
  // ✅ 컴포넌트 사라질 때 광고 숨기기 (메모리 누수 방지)
  AdMob.hideBanner().catch(() => {})
})
</script>

<style scoped>
.ad-bar {
  width: 100%;
  /* ✅ 앱 테마 배경색 연동 (없으면 기본 회색) */
  background-color: var(--custom-bg, #f1f1f1);
  border-top: 1px solid #ccc; /* 위쪽 선 */
}
</style>