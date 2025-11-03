<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useIntervalFn, useStorage } from '@vueuse/core'
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
const RESEND_DURATION_SECONDS = 5 * 60
const RESEND_STORAGE_KEY = 'verify-otp:resend-expiry'

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

const resendExpiry = useStorage<number | null>(RESEND_STORAGE_KEY, null)
const remainingSeconds = ref(0)

const syncRemaining = () => {
  if (!resendExpiry.value) {
    remainingSeconds.value = 0
    return
  }

  const diff = Math.ceil((resendExpiry.value - Date.now()) / 1000)
  if (diff > 0) {
    remainingSeconds.value = diff
    return
  }

  remainingSeconds.value = 0
  resendExpiry.value = null
}

const startCooldown = () => {
  resendExpiry.value = Date.now() + RESEND_DURATION_SECONDS * 1000
  syncRemaining()
}

if (!resendExpiry.value) {
  startCooldown()
} else {
  syncRemaining()
}

useIntervalFn(syncRemaining, 1000)

const isCooldown = computed(() => remainingSeconds.value > 0)

const formattedRemaining = computed(() => {
  if (!isCooldown.value) {
    return ''
  }

  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
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
  if (isCooldown.value) {
    return
  }

  toast.info('Verification code sent', {
    description: 'Please check your email for the latest code',
  })
  startCooldown()
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
              class="pl-1 font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-60"
              :disabled="isCooldown || isSubmitting"
              @click="onResend"
            >
              <template v-if="isCooldown">Resend in {{ formattedRemaining }}</template>
              <template v-else>Resend</template>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
