<template>
  <div class="contact-card" style="background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; transition: all 0.2s;"
       onmouseover="this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'"
       onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
    
    <!-- Contact Header -->
    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
      <div style="flex: 1;">
        <h3 style="font-size: 1.125rem; font-weight: 600; color: #111827; margin: 0 0 0.25rem 0;">
          {{ contact.name }}
        </h3>
        <div v-if="contact.location" class="location-tag" style="display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background-color: #dcfce7; color: #166534;">
          <Icon name="heroicons:map-pin" style="width: 0.75rem; height: 0.75rem; margin-right: 0.25rem;" />
          {{ contact.location.name }}
        </div>
      </div>
      
      <!-- Actions Menu (Admin Only) -->
      <div v-if="isAdmin" style="position: relative;">
        <button
          @click="showActions = !showActions"
          style="padding: 0.25rem; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: background-color 0.2s;"
          onmouseover="this.style.backgroundColor='#f3f4f6'"
          onmouseout="this.style.backgroundColor='transparent'"
        >
          <Icon name="heroicons:ellipsis-vertical" style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" />
        </button>
        
        <!-- Dropdown Menu -->
        <div
          v-if="showActions"
          class="dropdown-menu"
          style="position: absolute; right: 0; top: 2rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; padding: 0.25rem; z-index: 10; min-width: 120px;"
        >
          <button
            @click="editContact"
            style="width: 100%; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.875rem; color: #374151; background: transparent; border: none; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
            onmouseover="this.style.backgroundColor='#f3f4f6'"
            onmouseout="this.style.backgroundColor='transparent'"
          >
            <Icon name="heroicons:pencil" style="width: 1rem; height: 1rem;" />
            Edit
          </button>
          <button
            @click="deleteContact"
            style="width: 100%; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.875rem; color: #dc2626; background: transparent; border: none; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; gap: 0.5rem;"
            onmouseover="this.style.backgroundColor='#f3f4f6'"
            onmouseout="this.style.backgroundColor='transparent'"
          >
            <Icon name="heroicons:trash" style="width: 1rem; height: 1rem;" />
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <!-- Phone -->
      <div v-if="contact.phone" style="display: flex; align-items: center; font-size: 0.875rem; color: #6b7280;">
        <Icon name="heroicons:phone" style="width: 1rem; height: 1rem; margin-right: 0.5rem; color: #9ca3af;" />
        <a :href="`tel:${contact.phone}`" style="color: inherit; text-decoration: none; transition: color 0.2s;"
           onmouseover="this.style.color='#2563eb'"
           onmouseout="this.style.color='#6b7280'">
          {{ contact.phone }}
        </a>
      </div>
      
      <!-- Email -->
      <div v-if="contact.email" style="display: flex; align-items: center; font-size: 0.875rem; color: #6b7280;">
        <Icon name="heroicons:envelope" style="width: 1rem; height: 1rem; margin-right: 0.5rem; color: #9ca3af;" />
        <a :href="`mailto:${contact.email}`" style="color: inherit; text-decoration: none; transition: color 0.2s; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
           onmouseover="this.style.color='#2563eb'"
           onmouseout="this.style.color='#6b7280'">
          {{ contact.email }}
        </a>
      </div>
      
      <!-- Notes -->
      <div v-if="contact.notes" style="font-size: 0.875rem; color: #6b7280;">
        <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0;">{{ contact.notes }}</p>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="contact.tags && contact.tags.length > 0" style="margin-top: 1rem;">
      <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
        <span
          v-for="tag in contact.tags.slice(0, 3)"
          :key="tag"
          class="tag"
          style="display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background-color: #dbeafe; color: #1e40af;"
        >
          {{ tag }}
        </span>
        <span
          v-if="contact.tags.length > 3"
          style="display: inline-flex; align-items: center; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background-color: #f3f4f6; color: #6b7280;"
        >
          +{{ contact.tags.length - 3 }}
        </span>
      </div>
    </div>

    <!-- Created Date -->
    <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 0.75rem; color: #9ca3af; margin: 0;">
        Added {{ formatDate(contact.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  contact: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['edit', 'delete'])

// State
const showActions = ref(false)

// Methods
const editContact = () => {
  showActions.value = false
  emit('edit', props.contact)
}

const deleteContact = () => {
  showActions.value = false
  emit('delete', props.contact.id)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style>
/* Dark mode styles */
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
  color: #d1d5db !important;
}

.dark .contact-card a:hover {
  color: #60a5fa !important;
}
</style>