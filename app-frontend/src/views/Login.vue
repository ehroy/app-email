<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
        <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/api/axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axiosInstance.post('/login', {
      email: email.value,
      password: password.value,
    })
    console.log(response.data)
    localStorage.setItem('token', response.data.token) // Simpan token ke localStorage
    router.push('/admin') // Redirect ke halaman admin
  } catch (error) {
    console.log(error)
    console.error('Login failed:', error)
    errorMessage.value = 'Login failed! Please check your credentials.'
  }
}
</script>
