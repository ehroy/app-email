<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Admin Dashboard</h1>
    <p>Welcome to the admin page.</p>
    <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token') // Hapus token
  router.push('/') // Redirect ke login
}
</script>
