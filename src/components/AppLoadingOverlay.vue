<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'

defineProps<{ active: boolean }>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="active"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-slate-950/60 text-white backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Spinner class="h-12 w-12" />
      <p class="text-sm uppercase tracking-[0.2em]">Loading...</p>
    </div>
  </Transition>
</template>
