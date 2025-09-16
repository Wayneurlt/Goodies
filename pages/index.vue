<template>
  <div style="min-height: 100vh; background-color: #f9fafb; font-family: system-ui, sans-serif;">
    <!-- Navbar -->
    <nav style="position: sticky; top: 0; z-index: 50; background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-bottom: 1px solid #e5e7eb;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <div class="navbar-content" style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
          <!-- Logo -->
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 2.5rem; height: 2.5rem; background-color: #2563eb; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
              <Icon name="heroicons:users" style="width: 1.5rem; height: 1.5rem; color: white;" />
            </div>
            <div>
              <h1 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin: 0;">Goodies</h1>
              <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">Contact Manager</p>
            </div>
          </div>
          
          <!-- Right side actions -->
          <div class="navbar-actions" style="display: flex; align-items: center; gap: 1rem;">
            <!-- Dark mode toggle -->
            <button
              @click="toggleDarkMode"
              style="padding: 0.5rem; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: background-color 0.2s;"
              onmouseover="this.style.backgroundColor='#f3f4f6'"
              onmouseout="this.style.backgroundColor='transparent'"
            >
              <Icon 
                :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
                style="width: 1.25rem; height: 1.25rem; color: #6b7280;"
              />
            </button>
            
            <!-- Admin Actions -->
            <div v-if="isAdmin" style="display: flex; align-items: center; gap: 0.5rem;">
              <button
                @click="showAddContactModal = true"
                style="background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
                onmouseover="this.style.backgroundColor='#1d4ed8'"
                onmouseout="this.style.backgroundColor='#2563eb'"
              >
                <Icon name="heroicons:plus" style="width: 1rem; height: 1rem;" />
                <span>Add Contact</span>
              </button>
              
              <!-- Admin Menu -->
              <div style="position: relative;">
                <button
                  @click="showAdminMenu = !showAdminMenu"
                  style="padding: 0.5rem; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: background-color 0.2s;"
                  onmouseover="this.style.backgroundColor='#f3f4f6'"
                  onmouseout="this.style.backgroundColor='transparent'"
                >
                  <Icon name="heroicons:user-circle" style="width: 1.25rem; height: 1.25rem; color: #6b7280;" />
                </button>
                
                <!-- Dropdown Menu -->
                <div
                  v-if="showAdminMenu"
                  class="dropdown-menu"
                  style="position: absolute; right: 0; top: 2.5rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; padding: 0.25rem; z-index: 10; min-width: 200px;"
                >
                  <div style="padding: 0.75rem; border-bottom: 1px solid #e5e7eb;">
                    <p style="font-size: 0.875rem; font-weight: 500; color: #111827; margin: 0;">{{ adminInfo?.name }}</p>
                    <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">{{ adminInfo?.email }}</p>
                  </div>
                  <button
                    @click="goToDashboard"
                    style="width: 100%; padding: 0.75rem; text-align: left; font-size: 0.875rem; color: #374151; background: transparent; border: none; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
                    onmouseover="this.style.backgroundColor='#f3f4f6'"
                    onmouseout="this.style.backgroundColor='transparent'"
                  >
                    <Icon name="heroicons:chart-bar" style="width: 1rem; height: 1rem;" />
                    Dashboard
                  </button>
                  <button
                    @click="logout"
                    style="width: 100%; padding: 0.75rem; text-align: left; font-size: 0.875rem; color: #dc2626; background: transparent; border: none; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
                    onmouseover="this.style.backgroundColor='#f3f4f6'"
                    onmouseout="this.style.backgroundColor='transparent'"
                  >
                    <Icon name="heroicons:arrow-right-on-rectangle" style="width: 1rem; height: 1rem;" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Login Button for non-admin -->
            <button
              v-else
              @click="$router.push('/login')"
              style="background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
              onmouseover="this.style.backgroundColor='#1d4ed8'"
              onmouseout="this.style.backgroundColor='#2563eb'"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" style="width: 1rem; height: 1rem;" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
      <!-- Hero Search Section -->
      <div class="hero-section" style="text-align: center; margin-bottom: 3rem;">
        <div class="hero-content" style="margin-bottom: 2rem;">
          <h1 class="hero-title" style="font-size: 3rem; font-weight: bold; color: #111827; margin: 0 0 1rem 0; line-height: 1.1;">
            Find Your Contacts
          </h1>
          <p class="hero-subtitle" style="font-size: 1.125rem; color: #6b7280; margin: 0 0 2rem 0; max-width: 32rem; margin-left: auto; margin-right: auto;">
            Search through your contacts by name, location, tags, or any other information
          </p>
        </div>
        
        <!-- Big Search Bar -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <Icon name="heroicons:magnifying-glass" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search contacts..."
              class="search-input"
              @input="debouncedSearch"
            />
          </div>
        </div>
        
        <!-- Filter Button -->
        <div style="display: flex; justify-content: center;">
          <button
            @click="showFilters = !showFilters"
            class="filter-button"
            style="background-color: #f3f4f6; color: #374151; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: none; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;"
            onmouseover="this.style.backgroundColor='#e5e7eb'"
            onmouseout="this.style.backgroundColor='#f3f4f6'"
          >
            <Icon name="heroicons:funnel" style="width: 1.25rem; height: 1.25rem;" />
            <span>Filter by Categories</span>
            <Icon 
              :name="showFilters ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
              style="width: 1rem; height: 1rem;"
            />
          </button>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filter-panel" style="background: white; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
        <div class="filters-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <!-- Location Filter -->
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Location</label>
            <select
              v-model="selectedLocation"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #111827; outline: none;"
              @change="applyFilters"
            >
              <option value="">All Locations</option>
              <option
                v-for="location in locations"
                :key="location.id"
                :value="location.id"
              >
                {{ location.name }} ({{ location._count?.contacts || 0 }})
              </option>
            </select>
          </div>
          
          <!-- Tag Filter -->
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Tag</label>
            <select
              v-model="selectedTag"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #111827; outline: none;"
              @change="applyFilters"
            >
              <option value="">All Tags</option>
              <option
                v-for="tag in stats?.allTags"
                :key="tag"
                :value="tag"
              >
                {{ tag }}
              </option>
            </select>
          </div>
          
          <!-- Clear Filters -->
          <div style="display: flex; align-items: end;">
            <button
              @click="clearFilters"
              style="width: 100%; background-color: #fef2f2; color: #dc2626; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
              onmouseover="this.style.backgroundColor='#fee2e2'"
              onmouseout="this.style.backgroundColor='#fef2f2'"
            >
              <Icon name="heroicons:x-mark" style="width: 1rem; height: 1rem;" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contacts Grid -->
      <div class="contacts-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
        <ContactCard
          v-for="contact in sortedContacts"
          :key="contact.id"
          :contact="contact"
          :is-admin="isAdmin"
          @edit="editContact"
          @delete="deleteContact"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" style="text-align: center; margin-top: 3rem;">
        <button
          @click="loadMore"
          :disabled="loading"
          style="background-color: #2563eb; color: white; padding: 0.75rem 2rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem; margin: 0 auto;"
          onmouseover="this.style.backgroundColor='#1d4ed8'"
          onmouseout="this.style.backgroundColor='#2563eb'"
        >
          <Icon v-if="loading" name="heroicons:arrow-path" style="width: 1.25rem; height: 1.25rem; animation: spin 1s linear infinite;" />
          <span>{{ loading ? 'Loading...' : 'Load More Contacts' }}</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && contacts.length === 0" style="text-align: center; padding: 4rem 0;">
        <div style="width: 6rem; height: 6rem; background-color: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          <Icon name="heroicons:users" style="width: 3rem; height: 3rem; color: #9ca3af;" />
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin: 0 0 0.5rem 0;">
          No contacts found
        </h3>
        <p style="color: #6b7280; margin: 0 0 1.5rem 0; max-width: 28rem; margin-left: auto; margin-right: auto;">
          {{ isAdmin ? 'Get started by adding your first contact, or try adjusting your search filters.' : 'No contacts match your current search criteria.' }}
        </p>
        <button
          v-if="isAdmin"
          @click="showAddContactModal = true"
          style="background-color: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem; margin: 0 auto;"
          onmouseover="this.style.backgroundColor='#1d4ed8'"
          onmouseout="this.style.backgroundColor='#2563eb'"
        >
          <Icon name="heroicons:plus" style="width: 1rem; height: 1rem;" />
          <span>Add Contact</span>
        </button>
      </div>
    </main>

    <!-- Add/Edit Contact Modal -->
    <ContactModal
      v-if="showAddContactModal || showEditContactModal"
      :contact="editingContact"
      :locations="locations"
      @close="closeModal"
      @save="saveContact"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const router = useRouter()

// Reactive state
const contacts = ref([])
const locations = ref([])
const stats = ref(null)
const loading = ref(false)
const hasMore = ref(false)
const nextCursor = ref(null)
const isAdmin = ref(false)
const adminInfo = ref(null)

// Filters
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedTag = ref('')

// Modals
const showAddContactModal = ref(false)
const editingContact = ref(null)
const showAdminMenu = ref(false)

// Dark mode
const { isDark, toggleDarkMode: toggleDark, initDarkMode } = useDarkMode()

// UI state
const showFilters = ref(false)

// Computed
const showEditContactModal = computed(() => editingContact.value !== null)

// Sort contacts alphabetically by name
const sortedContacts = computed(() => {
  return [...contacts.value].sort((a, b) => a.name.localeCompare(b.name))
})

// Methods
const toggleDarkMode = () => {
  toggleDark()
}

const goToDashboard = () => {
  console.log('Navigating to dashboard...')
  navigateTo('/admin')
}



const checkAuth = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.success) {
      isAdmin.value = true
      adminInfo.value = response.admin
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    isAdmin.value = false
    adminInfo.value = null
  }
}

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    isAdmin.value = false
    adminInfo.value = null
    showAdminMenu.value = false
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const loadContacts = async (cursor = null) => {
  try {
    loading.value = true
    const params = new URLSearchParams()
    params.append('limit', '20')
    if (cursor) params.append('cursor', cursor)
    
    const response = await $fetch(`/api/contacts?${params}`)
    if (response && response.data) {
      if (cursor) {
        contacts.value.push(...response.data)
      } else {
        contacts.value = response.data
      }
      
      hasMore.value = response.nextCursor !== null
      nextCursor.value = response.nextCursor
    }
  } catch (error) {
    console.error('Error loading contacts:', error)
    // Show user-friendly error message
    if (error.statusCode === 500) {
      console.error('Server error - check database connection')
    }
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    loadContacts(nextCursor.value)
  }
}

const loadLocations = async () => {
  try {
    const response = await $fetch('/api/locations')
    if (response && Array.isArray(response)) {
      locations.value = response
    }
  } catch (error) {
    console.error('Error loading locations:', error)
    if (error.statusCode === 500) {
      console.error('Server error - check database connection')
    }
  }
}

const loadStats = async () => {
  try {
    const response = await $fetch('/api/dashboard/stats')
    if (response) {
      stats.value = response
    }
  } catch (error) {
    console.error('Error loading stats:', error)
    if (error.statusCode === 500) {
      console.error('Server error - check database connection')
    }
  }
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams()
    params.append('limit', '20')
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (selectedLocation.value) params.append('location', selectedLocation.value)
    if (selectedTag.value) params.append('tag', selectedTag.value)
    
    const response = await $fetch(`/api/contacts?${params}`)
    contacts.value = response.data
    hasMore.value = response.nextCursor !== null
    nextCursor.value = response.nextCursor
  } catch (error) {
    console.error('Error applying filters:', error)
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLocation.value = ''
  selectedTag.value = ''
  applyFilters()
}

const editContact = (contact) => {
  editingContact.value = contact
  showAddContactModal.value = false
}

const deleteContact = async (contactId) => {
  if (!confirm('Are you sure you want to delete this contact?')) return
  
  try {
    await $fetch(`/api/contacts/${contactId}`, { method: 'DELETE' })
    contacts.value = contacts.value.filter(c => c.id !== contactId)
  } catch (error) {
    console.error('Error deleting contact:', error)
  }
}

const closeModal = () => {
  showAddContactModal.value = false
  editingContact.value = null
}

const saveContact = async (contactData) => {
  try {
    if (editingContact.value) {
      // Update existing contact
      await $fetch(`/api/contacts/${editingContact.value.id}`, {
        method: 'PUT',
        body: contactData
      })
      // Update the contact in the list
      const index = contacts.value.findIndex(c => c.id === editingContact.value.id)
      if (index !== -1) {
        contacts.value[index] = { ...contacts.value[index], ...contactData }
      }
    } else {
      // Create new contact
      const response = await $fetch('/api/contacts', {
        method: 'POST',
        body: contactData
      })
      contacts.value.unshift(response)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving contact:', error)
  }
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Lifecycle
onMounted(async () => {
  // Initialize dark mode
  initDarkMode()
  
  // Load initial data
  await Promise.all([
    checkAuth(),
    loadContacts(),
    loadLocations(),
    loadStats()
  ])
})
</script>

<style>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Dark mode styles */
.dark {
  background-color: #111827 !important;
  color: #f9fafb !important;
}

.dark nav {
  background-color: #1f2937 !important;
  border-bottom-color: #374151 !important;
}

.dark nav h1, .dark nav p {
  color: #f9fafb !important;
}

.dark h1, .dark h3 {
  color: #f9fafb !important;
}

.dark p {
  color: #d1d5db !important;
}

.dark input {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  color: #f9fafb !important;
}

.dark input::placeholder {
  color: #9ca3af !important;
}

.dark select {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  color: #f9fafb !important;
}

.dark select option {
  background-color: #1f2937 !important;
  color: #f9fafb !important;
}

.dark button {
  color: #f9fafb !important;
}

.dark .filter-panel {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

.dark label {
  color: #d1d5db !important;
}

.dark .contact-card {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

.dark .contact-card h3 {
  color: #f9fafb !important;
}

.dark .contact-card p {
  color: #d1d5db !important;
}

.dark .contact-card a {
  color: #60a5fa !important;
}

.dark .contact-card a:hover {
  color: #93c5fd !important;
}

.dark .dropdown-menu {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

.dark .dropdown-menu p {
  color: #f9fafb !important;
}

.dark .dropdown-menu button {
  color: #d1d5db !important;
}

.dark .dropdown-menu button:hover {
  background-color: #374151 !important;
}

.dark .tag {
  background-color: #1e40af !important;
  color: #93c5fd !important;
}

.dark .location-tag {
  background-color: #166534 !important;
  color: #86efac !important;
}

/* Search Bar Styles - Mobile First */
.search-container {
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 1.5rem auto;
  padding: 0 1rem;
  box-sizing: border-box;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  font-size: 16px; /* Prevents zoom on iOS */
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  color: #111827;
  outline: none;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Desktop styles */
@media (min-width: 769px) {
  .search-container {
    padding: 0;
  }
  
  .search-icon {
    left: 1rem;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .search-input {
    padding: 1rem 1rem 1rem 3rem;
    font-size: 1.125rem;
  }
}

/* Dark mode search bar styles */
.dark .search-input {
  background-color: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .search-input::placeholder {
  color: #9ca3af;
}

.dark .search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  /* Navbar mobile styles */
  .navbar-content {
    height: 3.5rem !important;
    padding: 0 0.5rem !important;
  }
  
  .navbar-actions {
    gap: 0.5rem !important;
  }
  
  .navbar-actions button span {
    display: none;
  }
  
  .navbar-actions button {
    padding: 0.5rem !important;
  }
  
  /* Hero section mobile styles */
  .hero-title {
    font-size: 2rem !important;
  }
  
  .hero-subtitle {
    font-size: 1rem !important;
    padding: 0 1rem;
  }
  
  /* Search bar mobile styles - already handled by mobile-first approach above */
  
  /* Filters mobile styles */
  .filters-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }
  
  .filter-panel {
    padding: 1rem !important;
    margin: 0 1rem 2rem 1rem !important;
  }
  
  /* Contacts grid mobile styles */
  .contacts-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    padding: 0 1rem;
  }
  
  /* Main content mobile styles */
  main {
    padding: 1rem 0 !important;
  }
  
  /* Filter button mobile styles */
  .filter-button {
    padding: 0.75rem 1rem !important;
    font-size: 0.875rem !important;
  }
  
  .filter-button span {
    display: none;
  }
}

/* Tablet responsive styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .contacts-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
  }
  
  .filters-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem !important;
  }
  
  .hero-subtitle {
    font-size: 0.875rem !important;
  }
  
  .search-container {
    padding: 0 0.5rem !important;
  }
  
  .search-input {
    padding: 0.75rem 0.75rem 0.75rem 2.25rem !important;
    font-size: 16px !important;
  }
  
  .search-icon {
    width: 1rem !important;
    height: 1rem !important;
    left: 0.625rem !important;
  }
}
</style>