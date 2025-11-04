<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useMutation } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import { apiResetPassword } from '@/api'

useHead({
  title: 'Reset password',
  meta: [{ name: 'description', content: 'Set a new password' }],
})

const route = useRoute()
const router = useRouter()

const email = computed(() => String(route.query.email ?? ''))
const otp = computed(() => String(route.query.otp ?? ''))

const ResetSchema = toTypedSchema(
  z
    .object({
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Za-z]/u, { message: 'Password must contain letters' })
        .regex(/[0-9]/u, { message: 'Password must contain numbers' }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
)

const {
  handleSubmit,
  isSubmitting,
  meta: formMeta,
  setErrors,
} = useForm({
  validationSchema: ResetSchema,
  initialValues: {
    password: '',
    confirmPassword: '',
  },
})

const { mutateAsync: resetPassword } = useMutation({
  mutationFn: apiResetPassword,
})

if (!email.value || !otp.value) {
  toast.error('Missing reset data', {
    description: 'Please restart the password reset process.',
  })
  router.replace({ name: 'forgot-password' })
}

const onSubmit = handleSubmit(async (values) => {
  if (!email.value || !otp.value) {
    toast.error('Missing reset data', {
      description: 'Please restart the password reset process.',
    })
    router.replace({ name: 'forgot-password' })
    return
  }

  try {
    await resetPassword({ email: email.value, otp: otp.value, password: values.password })
    toast.success('Password updated', {
      description: 'You can now sign in with your new password.',
    })
    router.push({ name: 'login' })
  } catch (error: any) {
    if (error?.response?.data?.err_code > 0) {
      const message = error.response.data.err_msg
      setErrors({ password: message })
      toast.error('Error', { description: message })
      return
    }
    toast.error('Error', { description: 'Something went wrong' })
  }
})
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6 w-full max-w-sm">
      <Card class="mx-auto w-full">
        <CardHeader class="space-y-2 text-center">
          <CardTitle class="text-xl">Create new password</CardTitle>
          <CardDescription>
            Choose a strong password for <span class="font-medium">{{ email }}</span
            >.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="grid gap-6">
            <FormField name="password" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autocomplete="new-password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="confirmPassword" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" autocomplete="new-password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full" :disabled="isSubmitting || !formMeta.valid">
              <Spinner v-if="isSubmitting" class="mr-2 h-4 w-4" />
              <span>Update password</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
