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

useHead({
  title: 'Signup',
  meta: [{ name: 'description', content: 'Signup to your account' }],
})

const router = useRouter()
const RegisterSchema = toTypedSchema(
  z
    .object({
      email: z.string().email(),
      first_name: z.string(),
      last_name: z.string(),
      password: z.string(),
    })
    .required(),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: RegisterSchema,
})

const { mutateAsync: register } = useMutation({
  mutationFn: apiRegister,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await register(values)
    toast.success('Success', {
      description: 'User registered successfully',
    })
    router.push({ name: 'login' })
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
          <CardTitle class="text-xl"> Sign Up </CardTitle>
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
            <Button type="submit" class="w-full" :disabled="isSubmitting">
              Create an account
            </Button>
            <Button variant="outline" class="w-full"> Sign up with GitHub </Button>
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
