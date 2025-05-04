<script setup lang="ts">
import { setBreadcrumbs } from '@/composables/breadcrumbs'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Dashboard',
  meta: [{ name: 'description', content: 'Welcome to Dashboard' }],
})

setBreadcrumbs([{ name: 'Dashboard' }])
</script>

<template>
  <AppLayout>
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
      <div class="aspect-video rounded-xl bg-muted/50" />
    </div>
    <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
  </AppLayout>
</template>
