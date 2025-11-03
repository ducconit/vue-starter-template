<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import { apiVerifyOtp } from '@/api'

useHead({
  title: 'Verify OTP',
  meta: [{ name: 'description', content: 'Verify your account using OTP' }],
})

const router = useRouter()
const otpLength = 5

const OtpSchema = toTypedSchema(
  z
    .object({
      otp: z
        .string()
        .regex(new RegExp(`^[0-9]{${otpLength}}$`), { message: `OTP must be ${otpLength} digits` }),
    })
    .required(),
)

const {
  handleSubmit,
  isSubmitting,
  meta: formMeta,
} = useForm({
  validationSchema: OtpSchema,
  initialValues: {
    otp: '',
  },
})

const { mutateAsync: verifyOtp } = useMutation({
  mutationFn: apiVerifyOtp,
})

const toArray = (otp?: string) => (otp ? otp.slice(0, otpLength).split('') : [])

const fromArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (item == null ? '' : String(item)))
      .join('')
      .slice(0, otpLength)
  }

  return typeof value === 'string' ? value.slice(0, otpLength) : ''
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await verifyOtp(values)
    toast.success('Success', {
      description: 'Your account has been verified',
    })
    router.push({ name: 'login' })
  } catch (error: any) {
    if (error?.response?.data?.err_code > 0) {
      toast.error('Error', {
        description: error.response.data.err_msg,
      })
      return
    }
    toast.error('Error', {
      description: 'Something went wrong',
    })
  }
})

const onResend = () => {
  toast.info('Verification code sent', {
    description: 'Please check your email for the latest code',
  })
}
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6 w-full max-w-sm">
      <Card class="mx-auto w-full">
        <CardHeader class="space-y-2 text-center">
          <CardTitle class="text-xl">Enter verification code</CardTitle>
          <CardDescription>We sent a 5-digit code to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="grid gap-6">
            <FormField name="otp" v-slot="{ value, handleChange }">
              <FormItem class="space-y-4">
                <FormControl>
                  <div class="flex justify-center">
                    <PinInput
                      id="pin-input"
                      otp
                      :model-value="toArray(value)"
                      :length="otpLength"
                      class="justify-center gap-2.5"
                      @update:model-value="(val) => handleChange(fromArray(val))"
                    >
                      <PinInputGroup class="gap-2.5">
                        <PinInputSlot
                          v-for="index in otpLength"
                          :key="index"
                          :index="index - 1"
                          class="h-12 w-12 rounded-md border text-lg"
                        />
                      </PinInputGroup>
                    </PinInput>
                  </div>
                </FormControl>
                <p class="text-center text-sm text-muted-foreground">
                  Enter the {{ otpLength }}-digit code sent to your email.
                </p>
                <FormMessage class="text-center" />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full" :disabled="isSubmitting || !formMeta.valid">
              <Spinner v-if="isSubmitting" class="mr-2 h-4 w-4" />
              <span>Verify Account</span>
            </Button>
          </form>
          <div class="mt-4 text-center text-sm text-muted-foreground">
            Didn't receive the code?
            <button
              type="button"
              class="pl-1 font-medium text-primary underline-offset-4 hover:underline"
              @click="onResend"
            >
              Resend
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
