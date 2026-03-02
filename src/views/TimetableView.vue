<script setup lang="ts">
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase' // 手順10で作成したauthを読み込む

const router = useRouter()

// ログアウトを実行する関数
const logout = async () => {
  try {
    // Firebaseの機能を使ってログアウト
    await signOut(auth)
    
    // ログアウトに成功したら、ログイン画面（/login）に戻る
    router.push('/login')
  } catch (error) {
    console.error("ログアウトエラー:", error)
    alert("ログアウトに失敗しました。")
  }
}
</script>

<template>
  <div class="timetable-container">
    <h1>マイ時間割</h1>
    <p>ここに時間割の表が表示されます</p>
    
    <button @click="logout" class="logout-button">ログアウト</button>
  </div>
</template>

<style scoped>
.timetable-container {
  padding: 20px;
}
.logout-button {
  margin-top: 20px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>