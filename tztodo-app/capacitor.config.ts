import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.duckdns.tztodo',
  appName: 'tztodo',
  webDir: 'empty',
  server: {
    url: 'https://tztodo.duckdns.org',
    cleartext: false
  }
};

export default config;