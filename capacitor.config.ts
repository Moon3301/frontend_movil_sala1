import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acdata.sala1',
  appName: 'Sala 1',
  webDir: 'dist/app-sala1/browser',
  // Comentar objeto SERVER cuando se compile a produccion
  server: {
    hostname: 'localhost',
    androidScheme: 'http',    // ⬅️  cambia de https → http
    cleartext: true           // Capacitor 7
  }
};

export default config;
