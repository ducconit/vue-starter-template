<script setup lang="ts">
import { setBreadcrumbs } from '@/composables/breadcrumbs'
import { useHead } from '@unhead/vue'
import { ref, onMounted, computed } from 'vue'
import {
  LucideUsers,
  LucideEye,
  LucideBarChart,
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucideActivity,
  LucideUserPlus,
} from 'lucide-vue-next'
import { Pie, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js'

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
)
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

useHead({
  title: 'Dashboard',
  meta: [{ name: 'description', content: 'Application Statistics Overview' }],
})

setBreadcrumbs([{ name: 'Dashboard' }])

// Sample data// User statistics
const totalUsers = ref(12458)
const activeUsers = ref(8723)
const pageViews = ref(45621)
const newUsers = ref(1245)

// Device statistics
const deviceData = ref({
  desktop: 5842,
  mobile: 4127,
  tablet: 1896,
  unknown: 593,
})
const todayNewUsers = ref(24)
const bounceRate = ref(32.5)
const conversionRate = ref(8.2)

// Dữ liệu cho biểu đồ traffic theo các khoảng thời gian
const dailyTrafficData = [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 1500 },
  { label: 'Wed', value: 1300 },
  { label: 'Thu', value: 1700 },
  { label: 'Fri', value: 2100 },
  { label: 'Sat', value: 1800 },
  { label: 'Sun', value: 1400 },
]

const weeklyTrafficData = [
  { label: 'Week 1', value: 5800 },
  { label: 'Week 2', value: 6700 },
  { label: 'Week 3', value: 7200 },
  { label: 'Week 4', value: 8100 },
]

const monthlyTrafficData = [
  { label: 'Jan', value: 12000 },
  { label: 'Feb', value: 19000 },
  { label: 'Mar', value: 15000 },
  { label: 'Apr', value: 22000 },
  { label: 'May', value: 28000 },
  { label: 'Jun', value: 26000 },
  { label: 'Jul', value: 31000 },
]

const yearlyTrafficData = [
  { label: '2019', value: 240000 },
  { label: '2020', value: 320000 },
  { label: '2021', value: 380000 },
  { label: '2022', value: 420000 },
  { label: '2023', value: 480000 },
  { label: '2024', value: 520000 },
]

// Dữ liệu hiện tại cho biểu đồ traffic
const trafficData = ref(monthlyTrafficData)

// Cấu hình biểu đồ đường cho Traffic Overview
const trafficChartData = computed(() => ({
  labels: trafficData.value.map((item) => item.label),
  datasets: [
    {
      label: 'Page Views',
      data: trafficData.value.map((item) => item.value),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}))

// Cấu hình options cho biểu đồ đường
const lineChartOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          return `Page Views: ${formatNumber(tooltipItem.raw)}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        callback: function (value: any) {
          return formatNumber(value)
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

// Sample data for top pages
const topPages = ref([
  { name: '/products', views: 12500, percentage: 27.4 },
  { name: '/home', views: 9800, percentage: 21.5 },
  { name: '/blog', views: 7200, percentage: 15.8 },
  { name: '/contact', views: 5400, percentage: 11.8 },
  { name: '/about', views: 4100, percentage: 9.0 },
])

// Cấu hình biểu đồ tròn cho phân bố thiết bị
const deviceChartData = computed(() => ({
  labels: ['Desktop', 'Mobile', 'Tablet', 'Unknown'],
  datasets: [
    {
      data: [
        deviceData.value.desktop,
        deviceData.value.mobile,
        deviceData.value.tablet,
        deviceData.value.unknown,
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)', // Desktop - Blue
        'rgba(255, 99, 132, 0.8)', // Mobile - Red
        'rgba(75, 192, 192, 0.8)', // Tablet - Green
        'rgba(201, 203, 207, 0.8)', // Unknown - Gray
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(201, 203, 207, 1)',
      ],
      borderWidth: 1,
    },
  ],
}))

// Cấu hình options cho biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          size: 12,
        },
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value} (${percentage}%)`
        },
      },
    },
  },
}

// Format number with thousands separator
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Time period selection
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'
const timePeriod = ref<TimePeriod>('monthly')

// Growth rate calculations
const growthRate = ref(12.8) // User growth rate
const pageViewGrowth = ref(-5.2) // Page view growth rate
const todayUserGrowth = ref(12) // Today's new user growth rate

// Update stats based on selected time period
const updateStats = () => {
  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu mới dựa trên khoảng thời gian
  // Đây là dữ liệu mẫu cho mục đích demo
  switch (timePeriod.value) {
    case 'daily':
      totalUsers.value = 2458
      activeUsers.value = 1723
      pageViews.value = 8621
      newUsers.value = 245
      growthRate.value = 5.2
      pageViewGrowth.value = 7.8
      trafficData.value = dailyTrafficData
      break
    case 'weekly':
      totalUsers.value = 5458
      activeUsers.value = 3723
      pageViews.value = 22621
      newUsers.value = 645
      growthRate.value = 8.5
      pageViewGrowth.value = 3.2
      trafficData.value = weeklyTrafficData
      break
    case 'monthly':
      totalUsers.value = 12458
      activeUsers.value = 8723
      pageViews.value = 45621
      newUsers.value = 1245
      growthRate.value = 12.8
      pageViewGrowth.value = -5.2
      trafficData.value = monthlyTrafficData
      break
    case 'yearly':
      totalUsers.value = 145458
      activeUsers.value = 98723
      pageViews.value = 545621
      newUsers.value = 15245
      growthRate.value = 24.5
      pageViewGrowth.value = 18.7
      trafficData.value = yearlyTrafficData
      break
  }
}

// Gọi updateStats khi component được tạo để hiển thị dữ liệu ban đầu
onMounted(() => {
  updateStats()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Overview Statistics -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Overview Statistics</h2>
      <Tabs v-model="timePeriod" @update:modelValue="updateStats" class="w-auto">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Users -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Users</CardTitle>
          <LucideUsers class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ formatNumber(totalUsers) }}</div>
            <div v-if="growthRate > 0" class="flex items-center text-green-500 text-xs">
              <LucideArrowUpRight class="h-3 w-3 mr-1" />
              <span>{{ growthRate }}%</span>
            </div>
            <div v-else class="flex items-center text-red-500 text-xs">
              <LucideArrowDownRight class="h-3 w-3 mr-1" />
              <span>{{ Math.abs(growthRate) }}%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>

      <!-- Active Users -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Active Users</CardTitle>
          <LucideActivity class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ formatNumber(activeUsers) }}</div>
            <span class="text-xs text-muted-foreground"
              >({{ Math.round((activeUsers / totalUsers) * 100) }}%)</span
            >
          </div>
          <p class="text-xs text-muted-foreground">Active in the last 30 days</p>
        </CardContent>
      </Card>

      <!-- New Users Today -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">New Users Today</CardTitle>
          <LucideUserPlus class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ todayNewUsers }}</div>
          <p class="text-xs text-muted-foreground">+{{ todayUserGrowth }}% from yesterday</p>
        </CardContent>
      </Card>

      <!-- Page Views -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Page Views</CardTitle>
          <LucideEye class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ formatNumber(pageViews) }}</div>
            <div v-if="pageViewGrowth > 0" class="flex items-center text-green-500 text-xs">
              <LucideArrowUpRight class="h-3 w-3 mr-1" />
              <span>{{ pageViewGrowth }}%</span>
            </div>
            <div v-else class="flex items-center text-red-500 text-xs">
              <LucideArrowDownRight class="h-3 w-3 mr-1" />
              <span>{{ Math.abs(pageViewGrowth) }}%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">In the last 30 days</p>
        </CardContent>
      </Card>

      <!-- Conversion Rate -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Conversion Rate</CardTitle>
          <LucideBarChart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ conversionRate }}%</div>
            <div class="flex items-center text-green-500 text-xs">
              <LucideArrowUpRight class="h-3 w-3 mr-1" />
              <span>2.1%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Detailed Statistics -->
    <div class="grid gap-6 md:grid-cols-7">
      <!-- Traffic Chart -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visits in the last 7 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] w-full">
            <!-- Biểu đồ đường sử dụng vue-chartjs -->
            <Line :data="trafficChartData" :options="lineChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Top Pages -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most viewed pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(page, index) in topPages"
              :key="index"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">{{ page.name }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-muted-foreground">{{ formatNumber(page.views) }}</span>
                <div class="w-20 h-2 rounded-full bg-muted overflow-hidden">
                  <div class="h-full bg-primary" :style="{ width: `${page.percentage}%` }"></div>
                </div>
                <span class="text-sm">{{ page.percentage }}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Device Statistics and Performance Metrics -->
    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      <!-- Device Distribution -->
      <Card>
        <CardHeader>
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>User distribution by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-64 w-full">
            <!-- Biểu đồ tròn sử dụng vue-chartjs -->
            <Pie :data="deviceChartData" :options="chartOptions" />
          </div>
          <div class="mt-4 grid grid-cols-4 gap-2">
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-full bg-[rgba(54,162,235,0.8)]"></div>
              <span class="text-xs">Desktop</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-full bg-[rgba(255,99,132,0.8)]"></div>
              <span class="text-xs">Mobile</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-full bg-[rgba(75,192,192,0.8)]"></div>
              <span class="text-xs">Tablet</span>
            </div>
            <div class="flex items-center gap-1">
              <div class="h-3 w-3 rounded-full bg-[rgba(201,203,207,0.8)]"></div>
              <span class="text-xs">Unknown</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Performance Metrics -->
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Other important indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <!-- Bounce Rate -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-sm font-medium">Bounce Rate</span>
                <span class="text-sm font-medium">{{ bounceRate }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-yellow-500"
                  :style="{ width: `${bounceRate}%` }"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground">
                Percentage of visitors who leave after viewing only one page
              </p>
            </div>

            <!-- New Users -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-sm font-medium">New Users</span>
                <span class="text-sm font-medium">{{ formatNumber(newUsers) }}</span>
              </div>
              <div class="h-2 w-full rounded-full bg-muted">
                <div
                  class="h-full rounded-full bg-green-500"
                  :style="{ width: `${(newUsers / totalUsers) * 100}%` }"
                ></div>
              </div>
              <p class="text-xs text-muted-foreground">Users who registered in the last 30 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
