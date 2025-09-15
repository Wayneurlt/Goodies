<template>
  <div class="admin-overview">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">Welcome to Admin Panel</h1>
        <p class="welcome-subtitle">Manage your contact management system efficiently</p>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-icon">
          <Icon name="heroicons:users" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats?.totalContacts || 0 }}</div>
          <div class="stat-label">Total Contacts</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <Icon name="heroicons:map-pin" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats?.totalLocations || 0 }}</div>
          <div class="stat-label">Locations</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">
          <Icon name="heroicons:chart-bar" />
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ stats?.recentContacts || 0 }}</div>
          <div class="stat-label">New This Week</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <button @click="navigateTo('/admin/dashboard')" class="action-card">
          <div class="action-icon dashboard">
            <Icon name="heroicons:chart-bar" />
          </div>
          <div class="action-content">
            <h3>Dashboard</h3>
            <p>View detailed analytics and statistics</p>
          </div>
        </button>
        
        <button @click="navigateTo('/admin/contacts')" class="action-card">
          <div class="action-icon contacts">
            <Icon name="heroicons:users" />
          </div>
          <div class="action-content">
            <h3>Manage Contacts</h3>
            <p>Add, edit, and organize contacts</p>
          </div>
        </button>
        
        <button @click="navigateTo('/')" class="action-card">
          <div class="action-icon view-site">
            <Icon name="heroicons:eye" />
          </div>
          <div class="action-content">
            <h3>View Main Site</h3>
            <p>See how the public site looks</p>
          </div>
        </button>
        
        <button @click="navigateTo('/admin/locations')" class="action-card">
          <div class="action-icon locations">
            <Icon name="heroicons:map-pin" />
          </div>
          <div class="action-content">
            <h3>Manage Locations</h3>
            <p>Add and organize locations</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h2 class="section-title">Recent Activity</h2>
      <div class="activity-list">
        <div v-if="recentContacts.length > 0" class="activity-items">
          <div v-for="contact in recentContacts.slice(0, 5)" :key="contact.id" class="activity-item">
            <div class="activity-icon">
              <Icon name="heroicons:user-plus" />
            </div>
            <div class="activity-content">
              <p class="activity-text">New contact added: <strong>{{ contact.name }}</strong></p>
              <p class="activity-time">{{ formatTimeAgo(contact.createdAt) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-activity">
          <Icon name="heroicons:clock" class="no-activity-icon" />
          <p>No recent activity</p>
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
const stats = ref(null)
const recentContacts = ref([])

// Methods
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/dashboard/stats')
    if (response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
}

const fetchRecentContacts = async () => {
  try {
    const response = await $fetch('/api/contacts?limit=10')
    if (response.data) {
      recentContacts.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch recent contacts:', error)
  }
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchStats(), fetchRecentContacts()])
})
</script>

<style scoped>
.admin-overview {
  max-width: 100%;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 3rem 2rem;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
}

.welcome-subtitle {
  font-size: 1.125rem;
  margin: 0;
  opacity: 0.9;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: white;
  border-radius: 0.75rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
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
  border-color: #667eea;
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
  flex-shrink: 0;
}

.action-icon.dashboard {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon.contacts {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-icon.view-site {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-icon.locations {
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

.recent-activity {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.activity-list {
  min-height: 200px;
}

.activity-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.no-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.no-activity-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .welcome-section {
    padding: 2rem 1rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    padding: 1rem;
  }
}

/* Dark mode */
.dark .stat-item,
.dark .action-card,
.dark .recent-activity {
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

.dark .action-content h3 {
  color: #f7fafc;
}

.dark .action-content p {
  color: #a0aec0;
}

.dark .activity-item {
  background: #4a5568;
  border-color: #718096;
}

.dark .activity-text {
  color: #d1d5db;
}

.dark .activity-time {
  color: #9ca3af;
}

.dark .no-activity {
  color: #9ca3af;
}
</style>