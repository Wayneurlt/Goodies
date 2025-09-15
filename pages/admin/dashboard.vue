<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome back, {{ adminInfo?.name }}!</h1>
        <p class="welcome-subtitle">Here's an overview of your contact management system</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total-contacts">
          <Icon name="heroicons:users" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats?.totalContacts || 0 }}</div>
          <div class="stat-label">Total Contacts</div>
          <div class="stat-change positive">
            <Icon name="heroicons:arrow-trending-up" />
            <span>+{{ stats?.recentContacts || 0 }} this week</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total-locations">
          <Icon name="heroicons:map-pin" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats?.totalLocations || 0 }}</div>
          <div class="stat-label">Active Locations</div>
          <div class="stat-change neutral">
            <Icon name="heroicons:globe-alt" />
            <span>Across Kenya</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon top-location">
          <Icon name="heroicons:building-office" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats?.topLocation || 'Nairobi' }}</div>
          <div class="stat-label">Top Location</div>
          <div class="stat-change neutral">
            <Icon name="heroicons:users" />
            <span>{{ stats?.topLocationCount || 0 }} contacts</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon recent-activity">
          <Icon name="heroicons:chart-bar" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats?.recentContacts || 0 }}</div>
          <div class="stat-label">New This Week</div>
          <div class="stat-change neutral">
            <Icon name="heroicons:calendar" />
            <span>Last 7 days</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon system-health">
          <Icon name="heroicons:heart" />
        </div>
        <div class="stat-content">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">System Uptime</div>
          <div class="stat-change positive">
            <Icon name="heroicons:check-circle" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon data-usage">
          <Icon name="heroicons:server" />
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatBytes(stats?.dataUsage || 0) }}</div>
          <div class="stat-label">Data Storage</div>
          <div class="stat-change neutral">
            <Icon name="heroicons:database" />
            <span>Database size</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <button @click="goToMainSite" class="action-card">
          <div class="action-icon view-contacts">
            <Icon name="heroicons:users" />
          </div>
          <div class="action-content">
            <h3>View All Contacts</h3>
            <p>Browse and manage all contacts</p>
          </div>
        </button>
        
        <button @click="showAddContactModal = true" class="action-card">
          <div class="action-icon add-contact">
            <Icon name="heroicons:plus" />
          </div>
          <div class="action-content">
            <h3>Add New Contact</h3>
            <p>Create a new contact entry</p>
          </div>
        </button>
        
        <button @click="exportContacts" class="action-card">
          <div class="action-icon export">
            <Icon name="heroicons:arrow-down-tray" />
          </div>
          <div class="action-content">
            <h3>Export Contacts</h3>
            <p>Download contact data</p>
          </div>
        </button>
        
        <button @click="showBulkImport = true" class="action-card">
          <div class="action-icon import">
            <Icon name="heroicons:arrow-up-tray" />
          </div>
          <div class="action-content">
            <h3>Bulk Import</h3>
            <p>Import multiple contacts</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Contact Management -->
    <div class="contact-management">
      <div class="section-header">
        <h2 class="section-title">Contact Management</h2>
        <div class="section-actions">
          <button @click="showAddContactModal = true" class="btn-primary">
            <Icon name="heroicons:plus" />
            <span>Add Contact</span>
          </button>
          <button @click="goToMainSite" class="btn-secondary">
            <Icon name="heroicons:arrow-right" />
            <span>View All</span>
          </button>
        </div>
      </div>
      
      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <Icon name="heroicons:magnifying-glass" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts..."
            @input="searchContacts"
            class="search-input"
          />
        </div>
        <select v-model="selectedLocation" @change="filterContacts" class="filter-select">
          <option value="">All Locations</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.name }}
          </option>
        </select>
      </div>
      
      <!-- Contacts List -->
      <div class="contacts-list">
        <div v-if="filteredContacts.length > 0" class="contacts-grid">
          <div
            v-for="contact in filteredContacts.slice(0, 8)"
            :key="contact.id"
            class="contact-item"
          >
            <div class="contact-avatar">
              <span>{{ contact.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="contact-info">
              <h3 class="contact-name">{{ contact.name }}</h3>
              <p class="contact-phone">{{ contact.phone }}</p>
              <div v-if="contact.email" class="contact-email">{{ contact.email }}</div>
            </div>
            <div class="contact-meta">
              <div class="contact-date">{{ formatDate(contact.createdAt) }}</div>
              <div v-if="contact.location" class="contact-location">
                <Icon name="heroicons:map-pin" />
                <span>{{ contact.location.name }}</span>
              </div>
            </div>
            <div class="contact-actions">
              <button @click="editContact(contact)" class="action-btn edit" title="Edit Contact">
                <Icon name="heroicons:pencil" />
              </button>
              <button @click="deleteContact(contact.id)" class="action-btn delete" title="Delete Contact">
                <Icon name="heroicons:trash" />
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <Icon name="heroicons:users" class="empty-icon" />
          <h3>No contacts found</h3>
          <p>{{ searchQuery || selectedLocation ? 'No contacts match your search criteria' : 'Get started by adding your first contact' }}</p>
          <button v-if="!searchQuery && !selectedLocation" @click="showAddContactModal = true" class="btn-primary">
            <Icon name="heroicons:plus" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Meta
definePageMeta({
  middleware: 'admin'
})

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

// Methods
const goToMainSite = () => {
  navigateTo('/')
}

const refreshData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchStats(),
      fetchAllContacts(),
      fetchLocations()
    ])
    console.log('Data refreshed successfully!')
  } catch (error) {
    console.error('Failed to refresh data')
  } finally {
    loading.value = false
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
    console.log('Contact deleted successfully!')
    await refreshData()
  } catch (error) {
    console.error('Failed to delete contact')
  }
}

const exportContacts = () => {
  console.log('Export feature coming soon!')
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Mobile responsive dashboard */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
}

.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

/* Mobile responsive header content */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}

.welcome-section {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

/* Mobile responsive welcome title */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.75rem;
    text-align: center;
  }
  
  .welcome-subtitle {
    text-align: center;
  }
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Mobile responsive stats grid */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.total-contacts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.total-locations {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.top-location {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.recent-activity {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon.system-health {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.stat-icon.data-usage {
  background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #38a169;
}

.stat-change.neutral {
  color: #718096;
}

.quick-actions {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Mobile responsive actions grid */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}

.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
}

.action-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.action-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.action-icon.view-contacts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon.add-contact {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-icon.export {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-icon.import {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.action-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
}

.action-content p {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.contact-management {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

/* Mobile responsive section header */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
}

.section-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Mobile responsive search filter */
@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
    gap: 0.75rem;
  }
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
  color: #a0aec0;
  width: 1.25rem;
  height: 1.25rem;
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

.contacts-list {
  min-height: 200px;
}

.contacts-grid {
  display: grid;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

/* Mobile responsive contact item */
@media (max-width: 768px) {
  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .contact-meta {
    text-align: left;
    margin-right: 0;
    width: 100%;
  }
  
  .contact-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

.contact-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
}

.contact-phone {
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0 0 0.125rem 0;
}

.contact-email {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
}

.contact-meta {
  text-align: right;
  margin-right: 1rem;
}

.contact-date {
  font-size: 0.75rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.contact-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #38a169;
  background: #f0fff4;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.contact-actions {
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

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #a0aec0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #718096;
  margin: 0 0 1.5rem 0;
}

/* Dark mode styles */
.dark .dashboard-container {
  background-color: #1a202c;
}

.dark .welcome-title {
  color: #f7fafc;
}

.dark .welcome-subtitle {
  color: #a0aec0;
}

.dark .refresh-btn {
  background: #2d3748;
  border-color: #4a5568;
  color: #a0aec0;
}

.dark .refresh-btn:hover:not(:disabled) {
  background: #4a5568;
  border-color: #718096;
}

.dark .stat-card {
  background: #2d3748;
  border-color: #4a5568;
}

.dark .stat-number {
  color: #f7fafc;
}

.dark .stat-label {
  color: #a0aec0;
}

.dark .section-title {
  color: #f7fafc;
}

.dark .action-card {
  background: #2d3748;
  border-color: #4a5568;
}

.dark .action-card:hover {
  border-color: #718096;
}

.dark .action-content h3 {
  color: #f7fafc;
}

.dark .action-content p {
  color: #a0aec0;
}

.dark .contact-management {
  background: #2d3748;
  border-color: #4a5568;
}

.dark .search-input {
  background: #4a5568;
  border-color: #718096;
  color: #f7fafc;
}

.dark .search-input:focus {
  border-color: #667eea;
}

.dark .filter-select {
  background: #4a5568;
  border-color: #718096;
  color: #f7fafc;
}

.dark .contact-item {
  background: #4a5568;
  border-color: #718096;
}

.dark .contact-item:hover {
  border-color: #a0aec0;
}

.dark .contact-name {
  color: #f7fafc;
}

.dark .contact-phone {
  color: #a0aec0;
}

.dark .contact-email {
  color: #718096;
}

.dark .contact-date {
  color: #a0aec0;
}

.dark .empty-state h3 {
  color: #f7fafc;
}

.dark .empty-state p {
  color: #a0aec0;
}
</style>