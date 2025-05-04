<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

const props = withDefaults(
  defineProps<{
    statusCode?: number
    fatal?: boolean
    unhandled?: boolean
    statusMessage?: string
    message?: string
    data?: unknown
    cause?: unknown
  }>(),
  {
    statusCode: 404,
    fatal: false,
    unhandled: false,
    statusMessage: '',
    message: "We can't find this page",
    data: undefined,
    cause: undefined,
  },
)

const title = computed(() => {
  if (!props.message) return 'Error'
  return props.message
})

useHead({ title })
</script>

<template>
  <EmptyLayout>
    <div class="relative flex h-screen items-center px-10 sm:px-40">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border/80%)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border/80%)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_70%_at_50%_0%,#000_70%,transparent_110%)]"
      />
      <div class="container relative z-[1]">
        <p class="mb-5 font-bold tracking-tight text-primary">{{ statusCode }} error</p>
        <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">{{ title }}</h1>
        <Button class="mt-5 cursor-pointer" @click="$router.push({ name: 'home' })">Take me home</Button>
      </div>
    </div>
  </EmptyLayout>
</template>
