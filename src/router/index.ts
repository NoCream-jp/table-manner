import { createRouter, createWebHistory } from 'vue-router'
import TimetableView from '../views/TimetableView.vue'
import LoginView from '../views/LoginView.vue'
import { auth } from '../firebase' // 認証状態を確認するために追加

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TimetableView,
      // このページはログイン必須であるという目印をつける
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// ページを移動する前に毎回実行される「門番」の処理
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser // 現在ログインしているユーザー情報

  if (requiresAuth && !isAuthenticated) {
    // ログイン必須のページなのに、ログインしていない場合はログイン画面へ飛ばす
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // ログイン画面に行こうとしているが、すでにログイン済みの場合は時間割画面へ飛ばす
    next('/')
  } else {
    next()
  }
})

export default router