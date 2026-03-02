<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase' // 手順10で作成したauthを読み込む

const router = useRouter()
const errorMessage = ref('') // エラーが起きた時に画面に表示する用

// Googleログインを実行する関数
const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    // Firebaseの機能を使って、Googleログインのポップアップを表示
    await signInWithPopup(auth, provider)
    
    // ログインに成功したら、トップページ（時間割画面）へ画面遷移する
    router.push('/')
  } catch (error) {
    console.error("ログインエラー:", error)
    errorMessage.value = 'ログインに失敗しました。もう一度お試しください。'
  }
}
</script>

<template>
  <div class="login-container">
    <h1>時間割アプリ</h1>
    <p>利用するにはログインしてください</p>
    
    <button @click="loginWithGoogle" class="login-button">
      Googleでログイン
    </button>
    
    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.login-container {
  text-align: center;
  margin-top: 100px;
}
.login-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
}
.login-button:hover {
  background-color: #357AE8;
}
.error-text {
  color: red;
  margin-top: 16px;
}
</style>