<script lang="ts" setup>
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useHead } from '@unhead/vue'
import { apiForgotPassword } from '@/api'
import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

useHead({
  title: 'Forgot Password',
  meta: [{ name: 'description', content: 'Forgot Password' }],
})

const LoginSchema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Email is invalid' }),
    })
    .required(),
)

const router = useRouter()

const {
  handleSubmit,
  isSubmitting,
  meta: formMeta,
} = useForm({
  validationSchema: LoginSchema,
  initialValues: {
    email: '',
  },
})

const { mutateAsync: forgotPassword } = useMutation({
  mutationFn: apiForgotPassword,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await forgotPassword(values)
    toast.success('Email sent', {
      description: 'Please check your inbox for the verification code',
    })
    router.push({
      name: 'forgot-password-verify',
      query: {
        email: values.email,
      },
    })
  } catch (e: any) {
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
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6 mx-auto w-full max-w-sm">
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl"> Forgot Password </CardTitle>
          <CardDescription> No worries, we'll send you reset instructions </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit">
            <div class="grid gap-6">
              <div class="grid gap-6">
                <div class="grid gap-3">
                  <FormField name="email" v-slot="{ componentField }">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          v-bind="componentField"
                          placeholder="john@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <Button type="submit" class="w-full" :disabled="isSubmitting || !formMeta.valid">
                  <Spinner v-if="isSubmitting" class="mr-2 h-4 w-4" />
                  <span>Send instructions</span>
                </Button>
              </div>
              <div class="text-center text-sm">
                Don't have an account?
                <RouterLink :to="{ name: 'register' }" class="underline underline-offset-4">
                  Register
                </RouterLink>
              </div>
            </div>
          </form>
          <p class="mt-8 text-center text-sm">
            <RouterLink
              class="font-semibold text-primary underline-offset-2 hover:underline"
              :to="{ name: 'login' }"
            >
              Back to Log in
            </RouterLink>
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
