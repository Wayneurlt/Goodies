<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
          <Icon name="heroicons:users" class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Goodies
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          Contact Management System
        </p>
      </div>

      <!-- Login Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Admin Login
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-center mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:lock-closed" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :disabled="loading"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.email || !form.password"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Icon v-if="loading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin mr-2" />
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <Icon name="heroicons:information-circle" class="w-4 h-4 mr-1" />
            Demo Credentials
          </h3>
          <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p><strong>Email:</strong> wayneurlt@gmail.com</p>
            <p><strong>Password:</strong> W20974802g@</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © 2024 Goodies Contact Manager. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotivue } from 'notivue'

// Meta
useHead({
  title: 'Admin Login - Goodies',
  meta: [
    { name: 'description', content: 'Admin login for Goodies contact management system' }
  ]
})

// Composables
const { notify } = useNotivue()
const { isDark, initDarkMode } = useDarkMode()

// State
const loading = ref(false)
const showPassword = ref(false)
const form = ref({
  email: '',
  password: ''
})

// Methods
const handleLogin = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })
    
    if (response.success) {
      notify.success('Login successful!')
      
      // Redirect to admin dashboard
      await navigateTo('/admin')
    }
  } catch (error) {
    console.error('Login error:', error)
    notify.error(error.data?.message || 'Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Initialize dark mode
  initDarkMode()
  
  // Check if already logged in
  try {
    const response = await $fetch('/api/auth/me')
    if (response.success) {
      await navigateTo('/admin')
    }
  } catch (error) {
    // Not logged in, stay on login page
  }
})
</script>

<style>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>