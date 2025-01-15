<template>
  <div class="w-64 bg-gray-800 text-white h-screen p-4">
    <button
      @click="toggleMenu"
      class="text-xl font-semibold bg-gray-700 px-4 py-2 mb-4 rounded-md hover:bg-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 inline-block mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    <div v-if="menuVisible" class="space-y-4">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="cursor-pointer hover:bg-gray-700 p-2 rounded-md"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuVisible: false,
      menuItems: ['Dashboard', 'Profile', 'Settings', 'Logout'],
    }
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible
    },
  },
}
</script>
