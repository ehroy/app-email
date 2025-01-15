<template>
  <div class="mx-auto flex">
    <Sidebar />
    <div class="p-6">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the admin page.</p>
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
// import Navbar from './Navbar.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token') // Hapus token
  router.push('/') // Redirect ke login
}
const subject = ref('')
const time = ref('')

const saveSettings = () => {
  // Simpan pengaturan ke server atau lakukan tindakan yang sesuai
  console.log('Subject:', subject.value)
  console.log('Time:', time.value)
}
</script>
