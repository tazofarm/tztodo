<template>
  <div class="ad-bar" :style="{ height: `${adHeight}px` }">
    <!-- 광고 자체는 네이티브로 표시되므로 이 div는 공간만 확보 -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdOptions,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob'

const adHeight = ref(60)

onMounted(async () => {
  await AdMob.initialize()

  const options: BannerAdOptions = {
    adId: 'ca-app-pub-3940256099942544/6300978111',
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: true,
  }

  await AdMob.showBanner(options)

  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
    if (size?.height) {
      adHeight.value = size.height
    }
  })
})

onUnmounted(() => {
  AdMob.hideBanner().catch(() => {})
})
</script>

<style scoped>
.ad-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  border-top: 1px solid #ccc;
  font-size: 0.9rem;
  color: #555;
}
</style>