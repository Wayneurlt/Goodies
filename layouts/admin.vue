<template>
  <div :class="{ 'dark': isDark }" class="admin-layout">
    <!-- Sidebar -->
    <aside :class="{ 'sidebar-collapsed': sidebarCollapsed }" class="admin-sidebar">
      <!-- Sidebar Header -->
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo-icon">
            <Icon name="heroicons:shield-check" />
          </div>
          <div v-if="!sidebarCollapsed" class="logo-text">
            <h1>Admin Panel</h1>
            <p>Goodies Manager</p>
          </div>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <Icon :name="sidebarCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <NuxtLink to="/admin/dashboard" class="nav-link" :class="{ 'active': $route.path === '/admin/dashboard' }">
              <Icon name="heroicons:chart-bar" />
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/admin/contacts" class="nav-link" :class="{ 'active': $route.path.startsWith('/admin/contacts') }">
              <Icon name="heroicons:users" />
              <span v-if="!sidebarCollapsed">Contacts</span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/admin/locations" class="nav-link" :class="{ 'active': $route.path.startsWith('/admin/locations') }">
              <Icon name="heroicons:map-pin" />
              <span v-if="!sidebarCollapsed">Locations</span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/admin/analytics" class="nav-link" :class="{ 'active': $route.path.startsWith('/admin/analytics') }">
              <Icon name="heroicons:chart-pie" />
              <span v-if="!sidebarCollapsed">Analytics</span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/admin/settings" class="nav-link" :class="{ 'active': $route.path.startsWith('/admin/settings') }">
              <Icon name="heroicons:cog-6-tooth" />
              <span v-if="!sidebarCollapsed">Settings</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="profile-avatar">
            <Icon name="heroicons:user-circle" />
          </div>
          <div v-if="!sidebarCollapsed" class="profile-info">
            <p class="profile-name">{{ adminInfo?.name }}</p>
            <p class="profile-role">Administrator</p>
          </div>
        </div>
        <div class="sidebar-actions">
          <button @click="toggleDarkMode" class="action-btn" title="Toggle Dark Mode">
            <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" />
          </button>
          <button @click="logout" class="action-btn logout-btn" title="Logout">
            <Icon name="heroicons:arrow-right-on-rectangle" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main">
      <!-- Top Header -->
      <header class="admin-header">
        <div class="header-content">
          <div class="header-left">
            <button @click="toggleSidebar" class="mobile-sidebar-toggle">
              <Icon name="heroicons:bars-3" />
            </button>
            <div class="breadcrumb">
              <span class="breadcrumb-item">{{ getCurrentPageTitle() }}</span>
            </div>
          </div>
          <div class="header-right">
            <button @click="goToMainSite" class="header-btn">
              <Icon name="heroicons:home" />
              <span>View Site</span>
            </button>
            <div class="header-actions">
              <button @click="refreshData" class="header-btn" :disabled="loading">
                <Icon name="heroicons:arrow-path" :class="{ 'animate-spin': loading }" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Meta
definePageMeta({
  middleware: 'admin'
})

// State
const isDark = ref(false)
const sidebarCollapsed = ref(false)
const adminInfo = ref(null)
const loading = ref(false)

// Methods
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value.toString())
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
}

const goToMainSite = () => {
  navigateTo('/')
}

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    // Emit refresh event to child components
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate refresh
  } finally {
    loading.value = false
  }
}

const getCurrentPageTitle = () => {
  const route = useRoute()
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/contacts': 'Contacts',
    '/admin/locations': 'Locations',
    '/admin/analytics': 'Analytics',
    '/admin/settings': 'Settings'
  }
  return titles[route.path] || 'Admin Panel'
}

const fetchAdminInfo = async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response.success) {
      adminInfo.value = response.admin
    }
  } catch (error) {
    console.error('Failed to fetch admin info:', error)
  }
}

// Lifecycle
onMounted(async () => {
  // Load preferences
  const savedDarkMode = localStorage.getItem('darkMode')
  const savedSidebarState = localStorage.getItem('sidebarCollapsed')
  
  if (savedDarkMode === 'true') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  
  if (savedSidebarState === 'true') {
    sidebarCollapsed.value = true
  }
  
  // Fetch admin info
  await fetchAdminInfo()
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  transition: background-color 0.3s ease;
}

/* Sidebar Styles */
.admin-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.logo-text p {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
  line-height: 1;
}

.sidebar-toggle {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-toggle:hover {
  background: #f7fafc;
  color: #2d3748;
}

/* Navigation Styles */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
  position: relative;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.active {
  background: #e6f3ff;
  color: #2563eb;
  border-right: 3px solid #2563eb;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #2563eb;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #f7fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5568;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.125rem 0;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  color: #718096;
  margin: 0;
  font-size: 0.75rem;
}

.sidebar-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.action-btn:hover {
  background: #f7fafc;
  color: #2d3748;
}

.logout-btn:hover {
  background: #fed7d7;
  color: #e53e3e;
}

/* Main Content Area */
.admin-main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed + .admin-main {
  margin-left: 80px;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-sidebar-toggle {
  display: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-sidebar-toggle:hover {
  background: #f7fafc;
  color: #2d3748;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover:not(:disabled) {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-content {
  flex: 1;
  padding: 2rem 1.5rem;
  overflow-y: auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .admin-main {
    margin-left: 0;
  }
  
  .mobile-sidebar-toggle {
    display: flex;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .header-btn span {
    display: none;
  }
}

/* Dark Mode Styles */
.dark .admin-layout {
  background-color: #1a202c;
}

.dark .admin-sidebar {
  background: #2d3748;
  border-right-color: #4a5568;
}

.dark .sidebar-header {
  border-bottom-color: #4a5568;
}

.dark .logo-text h1 {
  color: #f7fafc;
}

.dark .logo-text p {
  color: #a0aec0;
}

.dark .sidebar-toggle {
  color: #a0aec0;
}

.dark .sidebar-toggle:hover {
  background: #4a5568;
  color: #f7fafc;
}

.dark .nav-link {
  color: #a0aec0;
}

.dark .nav-link:hover {
  background: #4a5568;
  color: #f7fafc;
}

.dark .nav-link.active {
  background: #1e3a8a;
  color: #93c5fd;
}

.dark .sidebar-footer {
  border-top-color: #4a5568;
}

.dark .profile-avatar {
  background: #4a5568;
  color: #a0aec0;
}

.dark .profile-name {
  color: #f7fafc;
}

.dark .profile-role {
  color: #a0aec0;
}

.dark .action-btn {
  color: #a0aec0;
}

.dark .action-btn:hover {
  background: #4a5568;
  color: #f7fafc;
}

.dark .logout-btn:hover {
  background: #742a2a;
  color: #fc8181;
}

.dark .admin-header {
  background: #2d3748;
  border-bottom-color: #4a5568;
}

.dark .breadcrumb-item {
  color: #f7fafc;
}

.dark .header-btn {
  background: #4a5568;
  border-color: #718096;
  color: #a0aec0;
}

.dark .header-btn:hover:not(:disabled) {
  background: #718096;
  border-color: #a0aec0;
}
</style>

