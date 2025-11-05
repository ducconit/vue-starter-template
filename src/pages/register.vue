<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/vue-query'
import { apiRegister } from '@/api'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import { Spinner } from '@/components/ui/spinner'
import { useOtpStore } from '@/stores'

useHead({
  title: 'Register',
  meta: [{ name: 'description', content: 'Register to your account' }],
})

const router = useRouter()
const otpStore = useOtpStore()
const RegisterSchema = toTypedSchema(
  z
    .object({
      email: z.string().email({ message: 'Email is invalid' }),
      first_name: z.string().min(1, { message: 'First name is required' }),
      last_name: z.string().min(1, { message: 'Last name is required' }),
      password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
      confirm_password: z.string().min(1, { message: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    })
    .required(),
)

const {
  handleSubmit,
  isSubmitting,
  meta: formMeta,
} = useForm({
  validationSchema: RegisterSchema,
  initialValues: {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  },
})

const { mutateAsync: register } = useMutation({
  mutationFn: apiRegister,
})

const onSubmit = handleSubmit(async (values) => {
  const { confirm_password: _confirmPassword, ...payload } = values
  try {
    await register(payload)
    toast.success('Success', {
      description: 'User registered successfully',
    })
    otpStore.setRegistrationEmail(values.email)
    router.push({ name: 'verify-otp' })
  } catch (e: any) {
    console.log(e)
    if (e?.response?.data?.err_code > 0) {
      toast.error('Error', {
        description: e?.response?.data?.err_msg,
      })
    }
  }
})
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-xl"> Register </CardTitle>
          <CardDescription> Enter your information to create an account </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <FormField name="first_name" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" placeholder="Max" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="grid gap-2">
                <FormField name="last_name" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" placeholder="Robinson" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
            <div class="grid gap-2">
              <FormField name="email" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="email" placeholder="m@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField name="password" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="grid gap-2">
              <FormField name="confirm_password" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <Button type="submit" class="w-full" :disabled="isSubmitting || !formMeta.valid">
              <Spinner v-if="isSubmitting" class="mr-2 h-4 w-4" />
              <span>Create an account</span>
            </Button>
            <div
              class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
            >
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div class="flex flex-col gap-4">
              <Button type="button" variant="outline" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
                  <path
                    d="M12 .5a12 12 0 0 0-3.794 23.4c.6.113.82-.26.82-.578v-2.047c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.757-1.334-1.757-1.091-.742.08-.727.08-.727 1.205.085 1.84 1.238 1.84 1.238 1.073 1.837 2.818 1.306 3.506.998.108-.787.42-1.307.763-1.607-2.665-.304-5.467-1.333-5.467-5.933 0-1.31.469-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.019.005 2.048.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.613-2.807 5.625-5.48 5.922.431.372.816 1.102.816 2.222v3.293c0 .321.216.697.825.578A12 12 0 0 0 12 .5"
                    fill="currentColor"
                  />
                </svg>
                Register with GitHub
              </Button>
              <Button type="button" variant="outline" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Register with Google
              </Button>
            </div>
          </form>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <RouterLink :to="{ name: 'login' }" class="underline"> Sign in </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
