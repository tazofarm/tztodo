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

router.isReady().then(async () => {
  app.mount('#app');

  if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) {
    try {
      await AdMob.initialize();

      // 광고 높이 감지 후 CSS 변수 설정
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

      // 앱 시작 시 한 번 표시
      await showBanner();

      // 페이지 전환 시마다 광고 다시 표시
      router.afterEach(async () => {
        try {
          await showBanner();
        } catch (err) {
          console.error('AdMob 광고 재표시 실패:', err);
        }
      });

    } catch (err) {
      console.error('AdMob 초기화 실패:', err);
    }
  }
});