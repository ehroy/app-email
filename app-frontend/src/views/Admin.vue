<template>
  <div class="settings">
    <h1>Admin Settings</h1>
    <form @submit.prevent="saveSettings">
      <div>
        <label>Email:</label>
        <input v-model="settings.email" type="email" required />
      </div>
      <div>
        <label>SMTP Server:</label>
        <input v-model="settings.smtpServer" type="text" required />
      </div>
      <div>
        <label>Port:</label>
        <input v-model="settings.port" type="number" required />
      </div>
      <div>
        <label>Use SSL:</label>
        <input v-model="settings.useSSL" type="checkbox" />
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      settings: {
        email: 'admin@example.com',
        smtpServer: 'smtp.example.com',
        port: 587,
        useSSL: true,
      },
    }
  },
  methods: {
    saveSettings() {
      console.log('Settings saved:', this.settings)
      alert('Settings have been saved!')
      // Simpan ke backend jika diperlukan, misalnya:
      // axios.post('/api/settings', this.settings).then(response => { ... });
    },
  },
}
</script>

<style>
.settings {
  max-width: 500px;
  margin: 0 auto;
}
form div {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
