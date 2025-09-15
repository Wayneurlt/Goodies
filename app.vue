<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </UApp>
</template>

<script setup lang="ts">
onMounted(() => {
 console.log(window.innerHeight, window.innerWidth);
});
</script>
