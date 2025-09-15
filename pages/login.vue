<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <Icon name="heroicons:users" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Goodies
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Admin Login
        </p>
      </div>

      <!-- Login Form -->
      <div class="card p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
              :disabled="loading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field pr-10"
                placeholder="Enter your password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :disabled="loading"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !form.email || !form.password"
            class="w-full btn-primary flex items-center justify-center"
            :class="{ 'opacity-50 cursor-not-allowed': loading || !form.email || !form.password }"
          >
            <Icon v-if="loading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin mr-2" />
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Demo Credentials:
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
          © 2024 Goodies Contact Manager
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotivue } from 'notivue'

// Meta
useHead({
  title: 'Admin Login - Goodies',
  meta: [
    { name: 'description', content: 'Admin login for Goodies contact management system' }
  ]
})

// Composables
const router = useRouter()
const { notify } = useNotivue()

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
      
      // Redirect to dashboard
      await router.push('/')
    }
  } catch (error) {
    console.error('Login error:', error)
    notify.error(error.data?.message || 'Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.success) {
      await router.push('/')
    }
  } catch (error) {
    // Not logged in, stay on login page
  }
})
</script>
