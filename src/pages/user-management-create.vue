<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save, UserPlus } from 'lucide-vue-next'
import { setBreadcrumbs } from '@/composables/breadcrumbs'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Router
const router = useRouter()

// Set breadcrumbs
setBreadcrumbs([
  { name: 'Dashboard', href: '/' },
  { name: 'User Management', href: '/user-management' },
  { name: 'Create User', href: '/user-management/create' },
])

// Định nghĩa schema xác thực với zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Tên là bắt buộc' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  role: z.string().min(1, { message: 'Vai trò là bắt buộc' }),
  status: z.string().default('Active'),
  bio: z.string().optional(),
  sendNotification: z.boolean().default(true),
})

// Khởi tạo form với vee-validate và zod
const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: '',
    email: '',
    role: '',
    status: 'Active',
    bio: '',
    sendNotification: true,
  },
})

// Preview avatar
const avatarPreview = ref('')

// Tạo computed để lấy giá trị form hiện tại
const formValues = computed(() => form.values)

// Update avatar when name changes
const updateAvatar = () => {
  // Generate avatar using DiceBear API with the user's name
  if (formValues.value.name) {
    avatarPreview.value = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      formValues.value.name,
    )}&backgroundColor=4f46e5`
  } else {
    avatarPreview.value = ''
  }
}

// Navigate back to user management
const goBack = () => {
  router.push({ name: 'user-management' })
}

// Submit form
const submitForm = form.handleSubmit((values) => {
  // Here you would typically send the data to your API
  console.log('Form submitted:', values)

  // For demo purposes, we'll just show an alert
  alert(`User Created: ${values.name} has been added as a ${values.role}`)

  // Redirect to user management page
  router.push({ name: 'user-management' })
})

// Get initials from name for avatar fallback
const getInitials = (name: string) => {
  return name
    ?.split(' ')
    ?.map((n) => n?.[0])
    ?.join('')
    ?.toUpperCase()
}
</script>

<template>
  <form @submit.prevent="submitForm" class="container mx-auto p-4">
    <div class="flex items-center gap-2 mb-6">
      <Button variant="outline" size="icon" @click="goBack">
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <h1 class="text-2xl font-bold">Create New User</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Thông tin người dùng -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="flex items-center space-x-2">
              <UserPlus class="h-5 w-5 text-primary" />
              <CardTitle>User Information</CardTitle>
            </div>
            <CardDescription> Enter the details for the new user </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Name -->
              <FormField name="name" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter user's full name"
                      @input="updateAvatar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Email -->
              <FormField name="email" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="email" placeholder="example@domain.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <div class="grid grid-cols-2 gap-4">
                <!-- Role -->
                <FormField name="role" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Administrator</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Status -->
                <FormField name="status" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select v-bind="componentField">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <!-- Bio -->
              <FormField name="bio" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      placeholder="Brief description or notes about this user"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Xem trước thông tin -->
      <div class="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>User Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-col items-center space-y-4">
              <Avatar class="h-24 w-24">
                <AvatarImage :src="avatarPreview" />
                <AvatarFallback>{{ getInitials(formValues.name || 'New User') }}</AvatarFallback>
              </Avatar>
              <div class="text-center">
                <p class="font-medium text-lg">{{ formValues.name || 'New User' }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ formValues.email || 'email@example.com' }}
                </p>
                <div class="mt-2 text-sm">
                  <span class="font-medium">Role:</span> {{ formValues.role || 'Not assigned' }}
                </div>
              </div>

              <div class="w-full pt-4 border-t mt-4">
                <FormField name="sendNotification" v-slot="{ value, handleChange }">
                  <div class="flex items-center justify-between">
                    <div>
                      <FormLabel>Send Welcome Email</FormLabel>
                      <FormDescription class="text-xs">
                        Send an email with login instructions
                      </FormDescription>
                    </div>
                    <FormItem>
                      <FormControl>
                        <Switch :model-value="value" @update:model-value="handleChange" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="flex flex-col gap-2 mt-4">
          <Button type="submit" class="w-full flex items-center justify-center gap-2">
            <Save class="h-4 w-4" />
            Create User
          </Button>
          <Button variant="outline" @click="goBack" class="w-full"> Cancel </Button>
        </div>
      </div>
    </div>
  </form>
</template>
