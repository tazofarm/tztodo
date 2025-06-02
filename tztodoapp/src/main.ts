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

import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
} from '@capacitor-community/admob';

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

router.isReady().then(async () => {
  app.mount('#app');

  if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) {
    try {
      await AdMob.initialize();

      AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
        if (size?.height) {
          document.documentElement.style.setProperty('--ad-height', `${size.height}px`);
        }
      });

      const showBanner = async () => {
        const options: BannerAdOptions = {
          adId: 'ca-app-pub-3940256099942544/6300978111',
          adSize: BannerAdSize.BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: true,
        };
        await AdMob.showBanner(options);
      };

      await showBanner();

      router.afterEach(async () => {
        try {
          await showBanner();
        } catch (err) {
          console.error('AdMob 광고 재표시 실패:', err);
        }

        // 👇 숨겨진 페이지 내 포커스 제거
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

    } catch (err) {
      console.error('AdMob 초기화 실패:', err);
    }
  }
});