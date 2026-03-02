import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbpaogEOgZo_4inLGbnIdA2iGod7m-tdw",
    authDomain: "table-manner.firebaseapp.com",
    projectId: "table-manner",
    storageBucket: "table-manner.firebasestorage.app",
    messagingSenderId: "608596684046",
    appId: "1:608596684046:web:61ba516694307293eafb5f"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// データベース（Firestore）をVueの他のファイルからも呼び出せるように設定
export const db = getFirestore(app);

// 認証をVueの他のファイルからも呼び出せるように設定
export const auth = getAuth(app);