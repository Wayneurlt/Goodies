<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Admin Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="heroicons:shield-check" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Goodies Contact Manager</p>
            </div>
          </div>
          
          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <!-- Dark mode toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <Icon 
                :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
                class="w-5 h-5 text-gray-600 dark:text-gray-300"
              />
            </button>
            
            <!-- Admin Menu -->
            <div class="relative">
              <button
                @click="showAdminMenu = !showAdminMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ adminInfo?.name?.charAt(0) || 'A' }}</span>
                </div>
                <div class="text-left hidden sm:block">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ adminInfo?.name || 'Admin' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ adminInfo?.email || 'admin@example.com' }}</p>
                </div>
                <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-400" />
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="showAdminMenu"
                class="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[200px]"
              >
                <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ adminInfo?.name || 'Admin' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ adminInfo?.email || 'admin@example.com' }}</p>
                </div>
                <button
                  @click="goToMainSite"
                  class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                >
                  <Icon name="heroicons:home" class="w-4 h-4 mr-2" />
                  View Main Site
                </button>
                <button
                  @click="logout"
                  class="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Dashboard Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {{ adminInfo?.name || 'Admin' }}!
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Here's an overview of your contact management system
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:users" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalContacts || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Contacts</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:map-pin" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.totalLocations || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Locations</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:building-office" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ stats?.topLocation || 'Nairobi' }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Top Location</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:clock" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.recentContacts || 0 }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Recent Adds</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            @click="goToMainSite"
            class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:users" class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <div class="text-left">
              <p class="font-medium text-blue-900 dark:text-blue-100">View Contacts</p>
              <p class="text-sm text-blue-700 dark:text-blue-300">Browse all contacts</p>
            </div>
          </button>
          
          <button
            @click="showAddContactModal = true"
            class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:plus" class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <div class="text-left">
              <p class="font-medium text-green-900 dark:text-green-100">Add Contact</p>
              <p class="text-sm text-green-700 dark:text-green-300">Create new contact</p>
            </div>
          </button>
          
          <button
            @click="exportContacts"
            class="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:arrow-down-tray" class="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div class="text-left">
              <p class="font-medium text-yellow-900 dark:text-yellow-100">Export Data</p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300">Download contacts</p>
            </div>
          </button>
          
          <button
            @click="showBulkImport = true"
            class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors duration-200"
          >
            <Icon name="heroicons:arrow-up-tray" class="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <div class="text-left">
              <p class="font-medium text-purple-900 dark:text-purple-100">Bulk Import</p>
              <p class="text-sm text-purple-700 dark:text-purple-300">Import multiple contacts</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Contact Management -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Contacts</h2>
          <div class="flex space-x-2">
            <button
              @click="showAddContactModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
              <span>Add Contact</span>
            </button>
            <button
              @click="goToMainSite"
              class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>
        </div>
        
        <!-- Search and Filter -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <div class="relative">
              <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search contacts..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="searchContacts"
              />
            </div>
          </div>
          <div class="sm:w-48">
            <select
              v-model="selectedLocation"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="filterContacts"
            >
              <option value="">All Locations</option>
              <option v-for="location in locations" :key="location.id" :value="location.id">
                {{ location.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Contacts List -->
        <div v-if="filteredContacts.length > 0" class="space-y-4">
          <div
            v-for="contact in filteredContacts.slice(0, 10)"
            :key="contact.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white font-medium">{{ contact.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ contact.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ contact.phone }}</p>
                <div v-if="contact.email" class="text-xs text-gray-500 dark:text-gray-500">{{ contact.email }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(contact.createdAt) }}</div>
                <div v-if="contact.location" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                  <Icon name="heroicons:map-pin" class="w-3 h-3 mr-1" />
                  {{ contact.location.name }}
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editContact(contact)"
                  class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  title="Edit Contact"
                >
                  <Icon name="heroicons:pencil" class="w-4 h-4" />
                </button>
                <button
                  @click="deleteContact(contact.id)"
                  class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  title="Delete Contact"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <Icon name="heroicons:users" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No contacts found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ searchQuery || selectedLocation ? 'No contacts match your search criteria' : 'Get started by adding your first contact' }}
          </p>
          <button
            v-if="!searchQuery && !selectedLocation"
            @click="showAddContactModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Icon name="heroicons:plus" class="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Add/Edit Contact Modal -->
    <ContactModal
      v-if="showAddContactModal"
      :show="showAddContactModal"
      :contact="editingContact"
      :locations="locations"
      :all-tags="stats?.allTags || []"
      @close="closeContactModal"
      @contact-saved="handleContactSaved"
    />

    <!-- Notifications -->
    <Notivue v-slot="item">
      <Notifications :item="item" />
    </Notivue>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notivue, Notifications, useNotivue } from 'notivue'
import ContactModal from '~/components/ContactModal.vue'

// Meta
definePageMeta({
  middleware: 'admin'
})

// Composables
const { push } = useNotivue()
const { isDark, toggleDarkMode, initDarkMode } = useDarkMode()

// State
const loading = ref(false)
const adminInfo = ref(null)
const stats = ref(null)
const allContacts = ref([])
const filteredContacts = ref([])
const locations = ref([])
const showAddContactModal = ref(false)
const editingContact = ref(null)
const searchQuery = ref('')
const selectedLocation = ref('')
const showAdminMenu = ref(false)

// Methods
const goToMainSite = () => {
  showAdminMenu.value = false
  navigateTo('/')
}

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    showAdminMenu.value = false
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchAdminInfo(),
      fetchStats(),
      fetchAllContacts(),
      fetchLocations()
    ])
  } catch (error) {
    console.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

const fetchAdminInfo = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.success) {
      adminInfo.value = response.admin
    }
  } catch (error) {
    console.error('Failed to fetch admin info')
  }
}

const fetchStats = async () => {
  try {
    const response = await $fetch('/api/dashboard/stats')
    if (response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats')
  }
}

const fetchAllContacts = async () => {
  try {
    const response = await $fetch('/api/contacts?limit=100')
    if (response.data) {
      allContacts.value = response.data
      filteredContacts.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch contacts')
  }
}

const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/locations')
    if (response.data) {
      locations.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch locations')
  }
}

const searchContacts = () => {
  filterContacts()
}

const filterContacts = () => {
  let filtered = [...allContacts.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.phone?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.location?.name.toLowerCase().includes(query) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (selectedLocation.value) {
    filtered = filtered.filter(contact => contact.location?.id === selectedLocation.value)
  }
  
  filteredContacts.value = filtered
}

const editContact = (contact) => {
  editingContact.value = contact
  showAddContactModal.value = true
}

const deleteContact = async (id) => {
  if (!confirm('Are you sure you want to delete this contact?')) {
    return
  }
  
  try {
    await $fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    push.success('Contact deleted successfully!')
    await refreshData()
  } catch (error) {
    push.error('Failed to delete contact')
  }
}

const closeContactModal = () => {
  showAddContactModal.value = false
  editingContact.value = null
}

const handleContactSaved = () => {
  closeContactModal()
  refreshData()
  push.success('Contact saved successfully!')
}

const exportContacts = () => {
  push.info('Export feature coming soon!')
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Lifecycle
onMounted(async () => {
  // Initialize dark mode
  initDarkMode()
  
  // Load initial data
  await refreshData()
})

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      showAdminMenu.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

