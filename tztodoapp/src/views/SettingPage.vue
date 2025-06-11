<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>설정</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- 실제 설정 항목을 포함한 컨테이너 -->
      <ZSettingContainer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import ZSettingContainer from '@/components/zsetting/ZSettingContainer.vue'
</script>