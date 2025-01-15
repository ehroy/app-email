<template>
  <div class="login-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: email.value,
          password: password.value,
        })
        localStorage.setItem('token', response.data.token) // Menyimpan token
        router.push('/admin') // Arahkan ke halaman utama
      } catch (error) {
        console.log(error)
        errorMessage.value = 'Login failed!'
      }
    }

    return {
      email,
      password,
      errorMessage,
      login,
    }
  },
}
</script>

<style scoped>
/* Styling untuk form login */
</style>
