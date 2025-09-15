<template>
  <div class="contacts-admin">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Contact Management</h1>
          <p class="page-subtitle">Manage all contacts in your system</p>
        </div>
        <div class="header-actions">
          <button @click="showAddModal = true" class="btn-primary">
            <Icon name="heroicons:plus" />
            <span>Add Contact</span>
          </button>
          <button @click="exportContacts" class="btn-secondary">
            <Icon name="heroicons:arrow-down-tray" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-filter">
        <div class="search-box">
          <Icon name="heroicons:magnifying-glass" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
            class="search-input"
            @input="debouncedSearch"
          />
        </div>
        <select v-model="selectedLocation" @change="applyFilters" class="filter-select">
          <option value="">All Locations</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.name }}
          </option>
        </select>
        <button @click="clearFilters" class="btn-secondary">
          <Icon name="heroicons:x-mark" />
          <span>Clear</span>
        </button>
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="contacts-table-container">
      <div class="table-header">
        <div class="table-info">
          <span class="table-count">{{ filteredContacts.length }} contacts</span>
          <span v-if="searchQuery || selectedLocation" class="filter-indicator">
            (filtered)
          </span>
        </div>
        <div class="table-actions">
          <button @click="refreshData" class="btn-secondary" :disabled="loading">
            <Icon name="heroicons:arrow-path" :class="{ 'animate-spin': loading }" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="contacts-table">
          <thead>
            <tr>
              <th class="sortable" @click="sortBy('name')">
                Name
                <Icon :name="getSortIcon('name')" class="sort-icon" />
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th>Location</th>
              <th>Tags</th>
              <th class="sortable" @click="sortBy('createdAt')">
                Created
                <Icon :name="getSortIcon('createdAt')" class="sort-icon" />
              </th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in paginatedContacts" :key="contact.id" class="contact-row">
              <td class="contact-name">
                <div class="name-cell">
                  <div class="contact-avatar">
                    {{ contact.name.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ contact.name }}</span>
                </div>
              </td>
              <td class="contact-phone">
                <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="phone-link">
                  {{ contact.phone }}
                </a>
                <span v-else class="no-data">-</span>
              </td>
              <td class="contact-email">
                <a v-if="contact.email" :href="`mailto:${contact.email}`" class="email-link">
                  {{ contact.email }}
                </a>
                <span v-else class="no-data">-</span>
              </td>
              <td class="contact-location">
                <span v-if="contact.location" class="location-badge">
                  {{ contact.location.name }}
                </span>
                <span v-else class="no-data">-</span>
              </td>
              <td class="contact-tags">
                <div v-if="contact.tags && contact.tags.length > 0" class="tags-container">
                  <span v-for="tag in contact.tags.slice(0, 2)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                  <span v-if="contact.tags.length > 2" class="more-tags">
                    +{{ contact.tags.length - 2 }}
                  </span>
                </div>
                <span v-else class="no-data">-</span>
              </td>
              <td class="contact-date">
                {{ formatDate(contact.createdAt) }}
              </td>
              <td class="contact-actions">
                <div class="action-buttons">
                  <button @click="editContact(contact)" class="action-btn edit" title="Edit Contact">
                    <Icon name="heroicons:pencil" />
                  </button>
                  <button @click="deleteContact(contact.id)" class="action-btn delete" title="Delete Contact">
                    <Icon name="heroicons:trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <Icon name="heroicons:chevron-left" />
        </button>
        
        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <Icon name="heroicons:chevron-right" />
        </button>
      </div>
    </div>

    <!-- Add/Edit Contact Modal -->
    <ContactModal
      v-if="showAddModal || showEditModal"
      :contact="editingContact"
      :locations="locations"
      @close="closeModal"
      @save="saveContact"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Meta
definePageMeta({
  middleware: 'admin'
})

// State
const loading = ref(false)
const contacts = ref([])
const locations = ref([])
const searchQuery = ref('')
const selectedLocation = ref('')
const showAddModal = ref(false)
const editingContact = ref(null)
const currentPage = ref(1)
const itemsPerPage = 20
const sortField = ref('name')
const sortDirection = ref('asc')

// Computed
const showEditModal = computed(() => editingContact.value !== null)

const filteredContacts = computed(() => {
  let filtered = [...contacts.value]
  
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
  
  // Sort
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (sortField.value === 'createdAt') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage))

const paginatedContacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredContacts.value.slice(start, end)
})

// Methods
const fetchContacts = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/contacts?limit=1000')
    contacts.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
  } finally {
    loading.value = false
  }
}

const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/locations')
    locations.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch locations:', error)
  }
}

const refreshData = async () => {
  await Promise.all([fetchContacts(), fetchLocations()])
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLocation.value = ''
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return 'heroicons:chevron-up-down'
  return sortDirection.value === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
}

const editContact = (contact) => {
  editingContact.value = contact
  showAddModal.value = false
}

const deleteContact = async (id) => {
  if (!confirm('Are you sure you want to delete this contact?')) {
    return
  }
  
  try {
    await $fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    await refreshData()
  } catch (error) {
    console.error('Failed to delete contact:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingContact.value = null
}

const saveContact = async (contactData) => {
  try {
    if (editingContact.value) {
      await $fetch(`/api/contacts/${editingContact.value.id}`, {
        method: 'PUT',
        body: contactData
      })
    } else {
      await $fetch('/api/contacts', {
        method: 'POST',
        body: contactData
      })
    }
    closeModal()
    await refreshData()
  } catch (error) {
    console.error('Failed to save contact:', error)
  }
}

const exportContacts = () => {
  console.log('Export feature coming soon!')
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
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
  await refreshData()
})
</script>

<style scoped>
.contacts-admin {
  max-width: 100%;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.filters-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.search-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #1a202c;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  min-width: 150px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #1a202c;
  outline: none;
  cursor: pointer;
}

.contacts-table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-count {
  font-weight: 600;
  color: #1a202c;
}

.filter-indicator {
  color: #718096;
  font-size: 0.875rem;
}

.table-wrapper {
  overflow-x: auto;
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
}

.contacts-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
}

.contacts-table th.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.contacts-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.contact-row:hover {
  background: #f8fafc;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-avatar {
  width: 2rem;
  height: 2rem;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.phone-link, .email-link {
  color: #667eea;
  text-decoration: none;
}

.phone-link:hover, .email-link:hover {
  text-decoration: underline;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
}

.location-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #dcfce7;
  color: #166534;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #dbeafe;
  color: #1e40af;
}

.more-tags {
  font-size: 0.75rem;
  color: #9ca3af;
}

.actions-column {
  width: 120px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.edit {
  background: #667eea;
  color: white;
}

.action-btn.edit:hover {
  background: #5a67d8;
}

.action-btn.delete {
  background: #e53e3e;
  color: white;
}

.action-btn.delete:hover {
  background: #c53030;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #718096;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: stretch;
  }
  
  .search-filter {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .table-wrapper {
    font-size: 0.875rem;
  }
  
  .contacts-table th,
  .contacts-table td {
    padding: 0.75rem 0.5rem;
  }
}

/* Dark mode */
.dark .page-title {
  color: #f7fafc;
}

.dark .page-subtitle {
  color: #a0aec0;
}

.dark .filters-section,
.dark .contacts-table-container {
  background: #2d3748;
  border-color: #4a5568;
}

.dark .search-input,
.dark .filter-select {
  background: #4a5568;
  border-color: #718096;
  color: #f7fafc;
}

.dark .contacts-table th {
  background: #4a5568;
  color: #a0aec0;
  border-bottom-color: #718096;
}

.dark .contact-row:hover {
  background: #4a5568;
}

.dark .contacts-table td {
  border-bottom-color: #4a5568;
}

.dark .pagination {
  border-top-color: #4a5568;
}

.dark .pagination-btn {
  background: #4a5568;
  border-color: #718096;
  color: #a0aec0;
}

.dark .pagination-btn:hover:not(:disabled) {
  background: #718096;
  border-color: #a0aec0;
}
</style>
