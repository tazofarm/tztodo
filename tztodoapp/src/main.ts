import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import '@ionic/vue/css/palettes/dark.system.css';

import './theme/variables.css';

import { AdMob, AdOptions } from '@capacitor-community/admob';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

// 👉 추가: 라우터 이동 직전에 포커스 제거
router.beforeEach((to, from, next) => {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    active.blur();
  }
  next();
});

router.isReady().then(() => {
  app.mount('#app');
});


async function initializeAdMob() {
  await AdMob.initialize();

  // 테스트 장비 지정 및 권한 설정 예시 (iOS의 ATT 등)
  // await AdMob.requestTrackingAuthorization();
}
initializeAdMob();