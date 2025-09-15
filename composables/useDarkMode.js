export const useDarkMode = () => {
  const isDark = ref(false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    updateDarkMode()
  }

  const setDarkMode = (dark) => {
    isDark.value = dark
    updateDarkMode()
  }

  const updateDarkMode = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }
  }

  const initDarkMode = () => {
    if (process.client) {
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'true') {
        isDark.value = true
        document.documentElement.classList.add('dark')
      } else {
        isDark.value = false
        document.documentElement.classList.remove('dark')
      }
    }
  }

  return {
    isDark: readonly(isDark),
    toggleDarkMode,
    setDarkMode,
    initDarkMode
  }
}

