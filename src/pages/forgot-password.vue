<script lang="ts" setup>
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { KeyRound, Mail, ArrowLeft } from 'lucide-vue-next'
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useHead } from '@unhead/vue'
import { apiForgotPassword } from '@/api'
import { useMutation } from '@tanstack/vue-query'

const description = "No worries, we'll send you reset instructions."
const isSendEmail = ref(false)

useHead({
  title: 'Forgot Password',
  meta: [{ name: 'description', content: 'Forgot Password' }],
})

const LoginSchema = toTypedSchema(
  z
    .object({
      email: z.string().email(),
    })
    .required(),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: LoginSchema,
})

const { mutateAsync: forgotPassword } = useMutation({
  mutationFn: (payload: any) => apiForgotPassword(payload),
})

const submit = handleSubmit(async (values) => {
  try {
    await forgotPassword(values)
    isSendEmail.value = true
  } catch (e: any) {
    console.log(e)
    if (e?.response?.data?.err_code > 0) {
      toast.error('Error', {
        description: e?.response?.data?.err_msg,
      })
      return
    }
    toast.error('Error', {
      description: 'Something went wrong',
    })
  }
})
</script>

<template>
  <EmptyLayout>
    <div class="relative flex h-screen items-center justify-center">
      <div
        class="absolute inset-0 z-[1] bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(circle,transparent_25%,theme(colors.border)_100%)]"
      />
      <div v-if="!isSendEmail" class="relative z-[2] w-full max-w-[340px] px-5">
        <div
          class="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg border bg-background"
        >
          <KeyRound class="size-6" />
        </div>

        <div class="flex flex-col items-center text-center">
          <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Forgot Password</h1>
          <p class="mt-1 text-muted-foreground">{{ description }}</p>
        </div>

        <form class="mt-10 grid gap-5" @submit="submit">
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" placeholder="john@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit" :disabled="isSubmitting"> Send instructions </Button>
        </form>
        <p class="mt-8 text-center text-sm">
          <RouterLink
            class="font-semibold text-primary underline-offset-2 hover:underline"
            :to="{ name: 'login' }"
          >
            Back to Log in
          </RouterLink>
        </p>
      </div>
      <div v-else class="relative z-[2] w-full max-w-[340px] px-5">
        <div
          class="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg border bg-background"
        >
          <Mail class="size-6" />
        </div>

        <div class="flex flex-col items-center text-center">
          <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">Check your inbox</h1>
          <p class="mt-1 text-muted-foreground">
            We've sent you an email with instructions to reset your password.
          </p>
        </div>

        <div class="mt-10">
          <Button class="w-full" type="button" @click.prevent="isSendEmail = false">
            <ArrowLeft class="size-5" />
            <span>Resend instructions</span>
          </Button>
        </div>
        <p class="mt-8 text-center text-sm">
          <RouterLink
            class="font-semibold text-primary underline-offset-2 hover:underline"
            :to="{ name: 'login' }"
          >
            Back to Log in
          </RouterLink>
        </p>
      </div>
    </div>
  </EmptyLayout>
</template>
