<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.afterEach(() => {
    const hiddenPages = document.querySelectorAll('.ion-page-hidden[aria-hidden="true"]');
    hiddenPages.forEach(page => {
      if (page.contains(document.activeElement)) {
        const active = document.activeElement;
        if (active instanceof HTMLElement) {
          active.blur();
        }
      }
    });
  });
});
</script>