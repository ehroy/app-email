import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Admin from '@/views/Admin.vue'
import axiosInstance from '@/api/axios'

const routes = [
  { path: '/', component: Login },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }, // Tandai rute ini memerlukan autentikasi
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      return next('/') // Redirect jika token tidak ada
    }

    try {
      // Validasi token dengan backend
      await axiosInstance.post('/authenticate')
      next() // Token valid, lanjutkan
    } catch (error) {
      console.error('Token invalid:', error)
      localStorage.removeItem('token') // Hapus token jika invalid
      next('/') // Redirect ke login
    }
  } else {
    next() // Rute tidak memerlukan autentikasi
  }
})

export default router
