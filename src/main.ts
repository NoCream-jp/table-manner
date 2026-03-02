import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth' // ログイン状態が変化したかを監視する機能

let app: any

// Firebaseがログイン状態の確認を終えたら実行される
onAuthStateChanged(auth, () => {
  if (!app) { // まだvueアプリが起動していなければ
    app = createApp(App)　// App.vueからアプリ本体を作成
    app.use(router) // アプリにrouterを組み込む
    app.mount('#app') // htmlのid="app"の位置にマウント
  }
})