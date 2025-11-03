<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { useHead } from '@unhead/vue'
import { useMutation } from '@tanstack/vue-query'
import { apiLogin } from '@/api'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores'

useHead({
  title: 'Login',
  meta: [{ name: 'description', content: 'Login to your account' }],
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const {
  isPending: isLoadingLogging,
  mutateAsync: login,
  isSuccess: isLoginSuccess,
} = useMutation({
  mutationFn: apiLogin,
})

const credentials = ref({
  email: '',
  password: '',
})

const onSubmit = async () => {
  try {
    const { data }: any = await login(credentials.value)
    authStore.setUserLoggedIn(data.token, data.user)

    if (route.query.redirect) {
      return router.push(route.query.redirect as string)
    }
    return router.push({ name: 'home' })
  } catch (e: any) {
    console.log(e)
    if (e?.response?.data?.err_code > 0) {
      toast.error(e?.response?.data?.err_msg)
    }
  }
}
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center px-4">
    <div class="flex flex-col gap-6 mx-auto w-full max-w-sm">
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl"> Login </CardTitle>
          <CardDescription> Login with your GitHub or Google account </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit">
            <div class="grid gap-6">
              <div class="grid gap-6">
                <div class="grid gap-3">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    v-model="credentials.email"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div class="grid gap-3">
                  <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <RouterLink
                      :to="{ name: 'forgot-password' }"
                      class="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </RouterLink>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    v-model="credentials.password"
                    required
                  />
                </div>
                <Button type="submit" class="w-full" :disabled="isLoadingLogging || isLoginSuccess">
                  Login
                </Button>
              </div>
              <div
                class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
              >
                <span class="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div class="flex flex-col gap-4">
                <Button variant="outline" class="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
                    <path
                      d="M12 .5a12 12 0 0 0-3.794 23.4c.6.113.82-.26.82-.578v-2.047c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.757-1.334-1.757-1.091-.742.08-.727.08-.727 1.205.085 1.84 1.238 1.84 1.238 1.073 1.837 2.818 1.306 3.506.998.108-.787.42-1.307.763-1.607-2.665-.304-5.467-1.333-5.467-5.933 0-1.31.469-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.019.005 2.048.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.613-2.807 5.625-5.48 5.922.431.372.816 1.102.816 2.222v3.293c0 .321.216.697.825.578A12 12 0 0 0 12 .5"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub
                </Button>
                <Button variant="outline" class="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div class="text-center text-sm">
                Don't have an account?
                <RouterLink :to="{ name: 'signup' }" class="underline underline-offset-4">
                  Sign up
                </RouterLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div
        class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
      >
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>
</template>
