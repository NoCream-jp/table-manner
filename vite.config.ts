import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// PWAプラグイン インポート
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // ↓ 追加：ここからPWAの設定
    VitePWA({
      registerType: 'autoUpdate', // アプリが更新されたら自動で新しいバージョンにする
      manifest: {
        name: 'Table Manner', // インストール時に表示される名前
        short_name: '時間割', // ホーム画面のアイコン下に表示される短い名前
        description: '自作の時間割アプリです',
        theme_color: '#ffffff', // ブラウザの上のバーの色など
        background_color: '#ffffff', // 起動時の背景色
        display: 'standalone', // URLバーを隠してアプリっぽく全画面表示する設定
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    // ↑ ここまで
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})