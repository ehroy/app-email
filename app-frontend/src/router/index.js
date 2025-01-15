import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import LoginView from '../views/Login.vue'
import AdminView from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'about',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true },
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token') // Ambil token dari localStorage
    console.log(token)
    try {
      const response = await axios.post('http://localhost:3000/api/authenticate', {
        email: email.value,
        password: password.value,
      })
      localStorage.setItem('token', response.data.token) // Menyimpan token
      router.push('/admin') // Arahkan ke halaman utama
    } catch (error) {
      console.log(error)
      errorMessage.value = 'Login failed!'
    }
    if (!token) {
      // Jika tidak ada token, redirect ke halaman login
      return next('/')
    }
    // (Opsional) Periksa validitas token ke server
    // Jika valid, lanjutkan
    // Jika tidak valid, hapus token dan redirect
  }
  next()
})

export default router
