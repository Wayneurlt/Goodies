<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Contact' : 'Add New Contact' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Enter contact name"
          />
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="input-field"
            placeholder="Enter phone number"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="input-field"
            placeholder="Enter email address"
          />
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <select
            id="location"
            v-model="form.locationId"
            class="input-field"
          >
            <option value="">Select a location</option>
            <option
              v-for="location in locations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            class="input-field"
            placeholder="Enter tags separated by commas"
            @blur="updateTags"
          />
          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="tag cursor-pointer"
              @click="removeTag(index)"
            >
              {{ tag }}
              <Icon name="heroicons:x-mark" class="w-3 h-3 ml-1" />
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            class="input-field resize-none"
            placeholder="Enter any additional notes"
          ></textarea>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.name.trim() || saving"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': !form.name.trim() || saving }"
          >
            <Icon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin mr-2" />
            {{ isEditing ? 'Update' : 'Create' }} Contact
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  contact: {
    type: Object,
    default: null
  },
  locations: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// State
const saving = ref(false)
const tagsInput = ref('')

// Form data
const form = ref({
  name: '',
  phone: '',
  email: '',
  locationId: null,
  tags: [],
  notes: ''
})

// Computed
const isEditing = computed(() => props.contact !== null)

// Methods
const updateTags = () => {
  if (tagsInput.value.trim()) {
    const newTags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !form.value.tags.includes(tag))
    
    form.value.tags = [...form.value.tags, ...newTags]
    tagsInput.value = ''
  }
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) return
  
  saving.value = true
  
  try {
    const contactData = {
      name: form.value.name.trim(),
      phone: form.value.phone.trim() || null,
      email: form.value.email.trim() || null,
      locationId: form.value.locationId || null,
      tags: form.value.tags,
      notes: form.value.notes.trim() || null
    }
    
    emit('save', contactData)
  } catch (error) {
    console.error('Error saving contact:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    locationId: null,
    tags: [],
    notes: ''
  }
  tagsInput.value = ''
}

const populateForm = () => {
  if (props.contact) {
    form.value = {
      name: props.contact.name || '',
      phone: props.contact.phone || '',
      email: props.contact.email || '',
      locationId: props.contact.locationId || null,
      tags: [...(props.contact.tags || [])],
      notes: props.contact.notes || ''
    }
  } else {
    resetForm()
  }
}

// Watch for contact changes
watch(() => props.contact, () => {
  populateForm()
}, { immediate: true })

// Lifecycle
onMounted(() => {
  populateForm()
})
</script>
