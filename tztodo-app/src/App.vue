<template>
  <ion-app>
    <ion-content>
      <iframe
        src="https://tztodo.duckdns.org"
        style="width: 100%; height: 100%; border: none;"
      ></iframe>
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent } from '@ionic/vue'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>