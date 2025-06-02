<template>
  <div></div> <!-- 광고는 네이티브로 표시되므로 UI 요소 필요 없음 -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
  AdMob,
  BannerAdSize,
  BannerAdPosition,
  BannerAdOptions,
} from '@capacitor-community/admob'

defineOptions({ name: 'AdBanner' })

const props = defineProps<{
  adUnitId?: string
  isTesting?: boolean
  position?: 'top' | 'bottom'
}>()

const unitId = props.adUnitId || 'ca-app-pub-3940256099942544/6300978111'
const isTesting = props.isTesting ?? true
const adPosition = props.position === 'top'
  ? BannerAdPosition.TOP_CENTER
  : BannerAdPosition.BOTTOM_CENTER

onMounted(async () => {
  await AdMob.initialize()

  const options: BannerAdOptions = {
    adId: unitId,
    adSize: BannerAdSize.BANNER,
    position: adPosition,
    margin: 0,
    isTesting,
  }

  await AdMob.showBanner(options)
})

onUnmounted(() => {
  AdMob.hideBanner().catch(() => {})
})
</script>