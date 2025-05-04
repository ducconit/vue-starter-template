<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Dashboard',
  titleTemplate: `%s %separator %appName`,
  templateParams: {
    separator: ' | ',
    appName: import.meta.env.VITE_APP_NAME,
  },
})
</script>

<template>
  <div>
    <router-view />
    <Toaster />
  </div>
</template>
