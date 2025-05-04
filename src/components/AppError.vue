<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { ArrowLeft, House } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import { useAppError } from '@/composables/useAppError'
import { useRouter } from 'vue-router'

const router = useRouter()
const statusCode = ref(404)
const title = ref('')
const description = ref('')
const { error, clearAppError } = useAppError()

const defaultTitles = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Page Not Found',
  500: 'Server Error',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
}

const defaultDescriptions = {
  400: 'The server cannot process the request due to a client error.',
  401: 'Authentication is required to access this resource.',
  403: "You don't have permission to access this resource.",
  404: "The page you're looking for doesn't exist or has been moved.",
  500: 'Something went wrong on our server. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
  504: 'The server timed out waiting for a response. Please try again later.',
}

const displayTitle = computed(() => {
  return title.value || defaultTitles[statusCode.value as keyof typeof defaultTitles] || 'Error'
})

const displayDescription = computed(() => {
  return (
    description.value ||
    defaultDescriptions[statusCode.value as keyof typeof defaultDescriptions] ||
    'An error occurred.'
  )
})

const clearErrorAndGoBack = () => {
  clearAppError()
  // if show error page then go back
  // router.back()
}

const clearErrorAndGoHome = () => {
  clearAppError()
  // TODO: check is authenticated then go to dashboard else go to login
  router.push({ name: 'home' })
}

onBeforeMount(() => {
  if (!error.value) {
    return
  }
  if (error.value instanceof ReferenceError) {
    statusCode.value = 500
    title.value = 'Server Error'
    description.value = 'Something went wrong on our server. Please try again later.'
    return
  }
})
</script>

<template>
  <div
    class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 md:px-6 lg:py-20"
  >
    <div class="flex flex-col items-center space-y-6 text-center">
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 362 145"
          class="h-10 w-10 text-primary"
        >
          <path
            fill="currentColor"
            d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
          />
        </svg>
      </div>
      <div class="space-y-2">
        <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl">
          {{ statusCode }} - {{ displayTitle }}
        </h1>
        <p
          class="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
        >
          {{ displayDescription }}
        </p>
      </div>
      <div class="flex flex-col gap-2 min-[400px]:flex-row">
        <div class="flex flex-col gap-2 min-[400px]:flex-row">
          <Button
            variant="outline"
            class="flex items-center gap-1"
            type="button"
            @click.prevent="clearErrorAndGoBack"
          >
            <ArrowLeft class="size-4" />
            Back
          </Button>
          <Button type="button" @click.prevent="clearErrorAndGoHome">
            <House class="size-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
