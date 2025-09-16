<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <div class="mb-4">
        <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto" />
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        {{ error.statusCode === 404 ? 'Page Not Found' : 'Something went wrong' }}
      </h1>
      
      <p class="text-gray-600 mb-6">
        {{ error.statusCode === 404 
          ? 'The page you are looking for does not exist.' 
          : 'An unexpected error occurred. Please try again later.' 
        }}
      </p>
      
      <div class="space-y-3">
        <button
          @click="handleError"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ error.statusCode === 404 ? 'Go Home' : 'Try Again' }}
        </button>
        
        <button
          @click="goBack"
          class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
      
      <!-- Development error details -->
      <div v-if="isDev && error.message" class="mt-6 p-4 bg-red-50 rounded-md text-left">
        <h3 class="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
        <pre class="text-xs text-red-700 whitespace-pre-wrap">{{ error.message }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const isDev = process.dev

const handleError = () => {
  if (props.error.statusCode === 404) {
    navigateTo('/')
  } else {
    clearError({ redirect: '/' })
  }
}

const goBack = () => {
  if (process.client && window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>
