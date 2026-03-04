<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase' // db（Firestore）を読み込む

const router = useRouter()

const days = ['月', '火', '水', '木', '金']
const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri']
const periods = [1, 2, 3, 4, 5, 6, 7]

const timetableData = ref<Record<string, any>>({})

// --- モーダル（入力画面）用の変数 ---
const showModal = ref(false)
const currentCellId = ref('') // 現在編集中のマス（例: mon_1）
const formData = ref({
  subject: '',
  room: '',
  teacher: ''
})

// --- データ読み込み機能 ---
const loadTimetable = async () => {
  const user = auth.currentUser
  if (!user) return

  try {
    // ログイン中のユーザーの classes コレクションを取得
    const classesRef = collection(db, 'users', user.uid, 'classes')
    const querySnapshot = await getDocs(classesRef)
    
    const loadedData: Record<string, any> = {}
    querySnapshot.forEach((doc) => {
      // ドキュメントID（mon_1など）をキーにしてデータを保存
      loadedData[doc.id] = doc.data()
    })
    
    timetableData.value = loadedData
  } catch (error) {
    console.error("データの読み込みに失敗しました:", error)
  }
}

// 画面が表示されたときにデータを読み込む
onMounted(() => {
  loadTimetable()
})

// --- セルをクリックしたときの処理 ---
const handleCellClick = (dayKey: string, period: number) => {
  const cellId = `${dayKey}_${period}`
  currentCellId.value = cellId
  
  // 既にデータがあればフォームにセット、なければ空にする
  if (timetableData.value[cellId]) {
    formData.value = { ...timetableData.value[cellId] }
  } else {
    formData.value = { subject: '', room: '', teacher: '' }
  }
  
  showModal.value = true // モーダルを表示
}

// --- データを保存する処理 ---
const saveClass = async () => {
  const user = auth.currentUser
  if (!user) return

  try {
    // 保存先の指定（users > [ユーザーID] > classes > [mon_1]）
    const docRef = doc(db, 'users', user.uid, 'classes', currentCellId.value)
    
    // データをFirestoreに保存
    await setDoc(docRef, formData.value)
    
    // 画面の表にも反映させる
    timetableData.value[currentCellId.value] = { ...formData.value }
    
    // モーダルを閉じる
    showModal.value = false
  } catch (error) {
    console.error("保存エラー:", error)
    alert("保存に失敗しました。")
  }
}

// データを削除する関数
const deleteClass = async () => {
  const user = auth.currentUser
  if (!user) return

  // 削除の確認アラートを出す
  if (!confirm("この授業を削除してもよろしいですか？")) return

  try {
    const docRef = doc(db, 'users', user.uid, 'classes', currentCellId.value)
    
    // Firestoreからデータを削除
    await deleteDoc(docRef)
    
    // 画面の表からもデータを消す
    delete timetableData.value[currentCellId.value]
    
    // モーダルを閉じる
    showModal.value = false
  } catch (error) {
    console.error("削除エラー:", error)
    alert("削除に失敗しました。")
  }
}

const closeModal = () => {
  showModal.value = false
}

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error("ログアウトエラー:", error)
    alert("ログアウトに失敗しました。")
  }
}
</script>

<template>
  <div class="timetable-container">
    <header class="header">
      <h1>マイ時間割</h1>
      <button @click="logout" class="logout-button">ログアウト</button>
    </header>

    <div class="table-wrapper">
      <table class="timetable">
        <thead>
          <tr>
            <th></th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="period in periods" :key="period">
            <td class="period-cell">{{ period }}</td>

            <td
              v-for="dayKey in dayKeys"
              :key="dayKey"
              class="class-cell"
              @click="handleCellClick(dayKey, period)"
            >
              <div v-if="timetableData[`${dayKey}_${period}`]" class="class-info">
                <div class="subject-name">{{ timetableData[`${dayKey}_${period}`].subject }}</div>
                <div class="room-name">{{ timetableData[`${dayKey}_${period}`].room }}</div>
              </div>
              <div v-else class="empty-cell">+</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>授業の登録</h2>

        <div class="form-group">
          <label>科目名</label>
          <input v-model="formData.subject" type="text" placeholder="例: プログラミング演習" />
        </div>
        <div class="form-group">
          <label>教室</label>
          <input v-model="formData.room" type="text" placeholder="例: 101教室" />
        </div>
        <div class="form-group">
          <label>担当教員</label>
          <input v-model="formData.teacher" type="text" placeholder="例: 山田太郎" />
        </div>

        <div class="modal-actions">
          <button 
            v-if="timetableData[currentCellId]" 
            @click="deleteClass"
            class="delete-button"
          >
            削除する
          </button>
          <div style="flex-grow: 1;"></div> <button @click="closeModal" class="cancel-button">キャンセル</button>
          <button 
            @click="saveClass"
            class="save-button"
          >保存する</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 今までのスタイル */
.body {
  padding: 10px;
}
.timetable-container {
  /* max-width: 800px; を削除して画面幅に合わせる */
  margin: 0 auto;
  padding: 0;
}
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.logout-button { padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; }
.table-wrapper {
  /* テーブル全体を角丸にする */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
.timetable {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed; /* 列幅の計算方法を指定 */
}
.timetable th, .timetable td {
  border: 1px solid #e0e0e0; /* 罫線の色を調整 */
  padding: 12px 4px;
  height: 80px;
  vertical-align: top;
  word-break: break-all; /* 長い単語でも折り返せるようにする */
}
.timetable th { background-color: #f5f5f5; height: auto; vertical-align: middle; }
.timetable th:first-child { width: 40px; }
.timetable .period-cell { background-color: #f9f9f9; font-weight: bold; vertical-align: middle;}
.class-cell { cursor: pointer; background-color: #ffffff; transition: background-color 0.2s; }
.class-cell:hover { background-color: #f0f8ff; }
.empty-cell { color: #ccc; font-size: 1.5em; display: flex; align-items: center; justify-content: center; height: 100%; }
.subject-name { font-weight: bold; font-size: 0.8em; margin-bottom: 4px; }
.room-name { font-size: 0.8em; color: #666; }

/* モーダル用のスタイル追加 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white; padding: 24px; border-radius: 12px; /* 角丸を調整 */
  width: 90%; max-width: 400px;
}
.form-group { margin-bottom: 16px; text-align: left; }
.form-group label { display: block; margin-bottom: 4px; font-weight: bold; }
.form-group input { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 8px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.delete-button { padding: 8px 16px; cursor: pointer; background-color: #f44336; border: none; color: white; border-radius: 8px; }
.cancel-button { padding: 8px 16px; cursor: pointer; background-color: #eee; border: none; border-radius: 8px; }
.save-button { padding: 8px 16px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 8px; }
</style>