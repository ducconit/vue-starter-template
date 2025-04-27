<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { setBreadcrumbs } from '@/composables/breadcrumbs'

useTitle('Home')

setBreadcrumbs([{ name: 'Home' }])
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
