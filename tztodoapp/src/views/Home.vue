<template>
  <ion-page>
    <ClockBar />
    <MainContent>
      <ion-router-outlet /> <!-- 여기 추가해야 child route가 나옴 -->
    </MainContent>
    <AdBar />
    <SafeBottomSpace />
  </ion-page>
</template>

<script setup>
import ClockBar from '@/components/ClockBar.vue'
import MainContent from '@/components/MainContent.vue'
import AdBar from '@/components/AdBar.vue'
import SafeBottomSpace from '@/components/SafeBottomSpace.vue'
import { IonPage, IonRouterOutlet } from '@ionic/vue'
</script>