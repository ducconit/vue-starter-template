<script lang="ts" setup>
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { ref } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useHead } from '@unhead/vue'
import { apiForgotPassword } from '@/api'
import { useMutation } from '@tanstack/vue-query'

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
  mutationFn: apiForgotPassword,
})

const onSubmit = handleSubmit(async (values) => {
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
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6 mx-auto w-full max-w-sm">
      <Card v-if="!isSendEmail">
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
                <Button type="submit" class="w-full" :disabled="isSubmitting">
                  Send instructions
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
      <Card v-else>
        <CardHeader class="text-center">
          <CardTitle class="text-xl"> Check your inbox </CardTitle>
          <CardDescription>
            We've sent you an email with instructions to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div class="grid gap-6">
              <div class="grid gap-6">
                <Button class="w-full mt-4" type="button" @click.prevent="isSendEmail = false">
                  <ArrowLeft class="size-5" />
                  <span>Resend instructions</span>
                </Button>
                <p class="mt-4 text-center text-sm">
                  <RouterLink
                    class="font-semibold text-primary underline-offset-2 hover:underline"
                    :to="{ name: 'login' }"
                  >
                    Back to Log in
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
