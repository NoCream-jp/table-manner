import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase' // 追加
import { onAuthStateChanged } from 'firebase/auth' // 追加

let app: any

// Firebaseがログイン状態の確認を終えたら実行される
onAuthStateChanged(auth, () => {
  if (!app) {
    // まだVueアプリが起動していなければ起動する
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
})