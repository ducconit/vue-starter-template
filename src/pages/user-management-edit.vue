<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { X, ArrowLeft, Save } from 'lucide-vue-next'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
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
// Import necessary components

const router = useRouter()
const route = useRoute()
// Define alert function for notifications
const userId = ref(Number(route.params.id))

// Form data
const formData = ref({
  name: '',
  email: '',
  role: '',
  status: 'Active',
  avatar: '',
  bio: '',
  lastLogin: '',
  sendNotification: false,
})

// Errors
const errors = ref({
  name: '',
  email: '',
  role: '',
})

// Preview avatar
const avatarPreview = ref('')
const avatarFile = ref<File | null>(null)

// Mẫu dữ liệu người dùng
const users = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-05-04T10:30:00',
    avatar: '',
    bio: 'System Administrator',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2025-05-03T14:20:00',
    avatar: '',
    bio: 'Accounting Department Staff',
  },
]

// Load user data
onMounted(() => {
  const user = users.find((u) => u.id === userId.value)
  if (user) {
    formData.value = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio || '',
      lastLogin: user.lastLogin,
      sendNotification: false,
    }

    if (user.avatar) {
      avatarPreview.value = user.avatar
    }
  } else {
    // Nếu không tìm thấy người dùng, quay lại trang quản lý
    router.push({ name: 'user-management' })
    alert('Error: User information not found')
  }
})

// Handle avatar upload
const handleAvatarUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    avatarFile.value = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}

// Remove avatar
const removeAvatar = () => {
  avatarPreview.value = ''
  avatarFile.value = null
  // Reset file input
  const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Validate form
const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    role: '',
  }

  // Validate name
  if (!formData.value.name.trim()) {
    errors.value.name = 'Username is required'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  // Validate role
  if (!formData.value.role) {
    errors.value.role = 'Role is required'
    isValid = false
  }

  return isValid
}

// Submit form
const submitForm = () => {
  if (validateForm()) {
    // Xử lý cập nhật người dùng
    console.log('Form data:', formData.value)

    // Hiển thị thông báo thành công
    alert(`Update Successful: User ${formData.value.name} has been updated`)

    // Chuyển hướng về trang quản lý người dùng
    router.push({ name: 'user-management' })
  }
}

// Quay lại trang quản lý người dùng
const goBack = () => {
  router.push({ name: 'user-management' })
}

// Lấy chữ cái đầu của tên người dùng cho avatar
const getInitials = (name: string) => {
  return name
    ?.split(' ')
    ?.map((n) => n?.[0])
    ?.join('')
    ?.toUpperCase()
}

// Format date and time using dayjs
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'

  try {
    // Parse date string with dayjs
    const date = dayjs(dateString)

    // Check if date is valid
    if (!date.isValid()) {
      return 'Invalid date'
    }

    // Format date using dayjs
    return date.format('MM/DD/YYYY hh:mm A')
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex items-center gap-2 mb-6">
      <Button variant="ghost" size="icon" @click="goBack">
        <ArrowLeft class="h-5 w-5" />
      </Button>
      <h1 class="text-2xl font-bold">Edit User</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Thông tin cơ bản -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Basic Information</h2>

          <Form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Họ tên -->
              <FormField name="name" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter user's full name" />
                  </FormControl>
                  <FormMessage v-if="errors.name">{{ errors.name }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Email -->
              <FormField name="email" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" type="email" placeholder="example@domain.com" />
                  </FormControl>
                  <FormMessage v-if="errors.email">{{ errors.email }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Vai trò -->
              <FormField name="role" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage v-if="errors.role">{{ errors.role }}</FormMessage>
                </FormItem>
              </FormField>

              <!-- Trạng thái -->
              <FormField name="status" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>

              <!-- Đăng nhập cuối -->
              <FormField name="lastLogin" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Last Login</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      :value="formatDate(formData.lastLogin)"
                      disabled
                    />
                  </FormControl>
                </FormItem>
              </FormField>
            </div>

            <!-- Giới thiệu -->
            <FormField name="bio" v-slot="{ componentField }">
              <FormItem class="mt-6">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Enter user bio information"
                    rows="4"
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <!-- Gửi thông báo -->
            <FormField name="sendNotification" v-slot="{ componentField }">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 mt-6"
              >
                <div class="space-y-0.5">
                  <FormLabel>Send Notification</FormLabel>
                  <FormDescription>
                    Send email notification to user about information update
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
          </Form>
        </div>
      </div>

      <!-- Avatar và các tùy chọn -->
      <div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Avatar</h2>

          <div class="flex flex-col items-center justify-center gap-4">
            <div class="relative">
              <Avatar class="w-32 h-32">
                <AvatarImage v-if="avatarPreview" :src="avatarPreview" alt="Avatar" />
                <AvatarFallback v-else class="text-2xl">
                  {{ formData.name ? getInitials(formData.name) : 'U' }}
                </AvatarFallback>
              </Avatar>

              <Button
                v-if="avatarPreview"
                variant="destructive"
                size="icon"
                class="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                @click="removeAvatar"
              >
                <X class="h-3 w-3" />
              </Button>
            </div>

            <div class="flex flex-col w-full gap-2">
              <Button variant="outline" class="w-full" as="label">
                Choose Image
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </Button>
              <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                Supports JPG, GIF or PNG. Maximum size 2MB.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Advanced Options</h2>

          <div class="space-y-4">
            <Button variant="outline" class="w-full">Reset Password</Button>
            <Button variant="outline" class="w-full">Send Verification Email</Button>
            <Button variant="outline" class="w-full">View Activity History</Button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Button
            type="submit"
            @click="submitForm"
            class="w-full flex items-center justify-center gap-2"
          >
            <Save class="h-4 w-4" />
            Save Changes
          </Button>
          <Button variant="outline" @click="goBack" class="w-full">Cancel</Button>
        </div>
      </div>
    </div>
  </div>
</template>
