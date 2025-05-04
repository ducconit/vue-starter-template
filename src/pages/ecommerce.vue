<script setup lang="ts">
import { setBreadcrumbs } from '@/composables/breadcrumbs'
import { useHead } from '@unhead/vue'
import { ref, onMounted, computed } from 'vue'
import {
  LucideShoppingCart,
  LucideDollarSign,
  LucideArrowUpRight,
  LucideArrowDownRight,
  LucidePackage,
  LucideBarChart,
  LucideShoppingBag,
  LucideTruck,
  LucidePercent,
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
  BarElement,
} from 'chart.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
  BarElement,
)

useHead({
  title: 'E-commerce Dashboard',
  meta: [{ name: 'description', content: 'E-commerce Statistics Overview' }],
})

setBreadcrumbs([{ name: 'Dashboard', to: '/' }, { name: 'E-commerce' }])

// Khoảng thời gian
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'
const timePeriod = ref<TimePeriod>('monthly')

// Thống kê cửa hàng
const totalRevenue = ref(124580)
const totalOrders = ref(1245)
const averageOrderValue = ref(100.06)
const conversionRate = ref(3.2)

// Thống kê sản phẩm
const totalProducts = ref(856)
const lowStockProducts = ref(24)
const outOfStockProducts = ref(12)

// Dữ liệu cho biểu đồ doanh thu theo các khoảng thời gian
const dailyRevenueData = [
  { label: 'Mon', value: 1200 },
  { label: 'Tue', value: 1500 },
  { label: 'Wed', value: 1300 },
  { label: 'Thu', value: 1700 },
  { label: 'Fri', value: 2100 },
  { label: 'Sat', value: 2400 },
  { label: 'Sun', value: 1800 },
]

const weeklyRevenueData = [
  { label: 'Week 1', value: 8500 },
  { label: 'Week 2', value: 9700 },
  { label: 'Week 3', value: 11200 },
  { label: 'Week 4', value: 10400 },
]

const monthlyRevenueData = [
  { label: 'Jan', value: 32000 },
  { label: 'Feb', value: 29000 },
  { label: 'Mar', value: 35000 },
  { label: 'Apr', value: 42000 },
  { label: 'May', value: 38000 },
  { label: 'Jun', value: 46000 },
  { label: 'Jul', value: 51000 },
]

const yearlyRevenueData = [
  { label: '2019', value: 340000 },
  { label: '2020', value: 420000 },
  { label: '2021', value: 580000 },
  { label: '2022', value: 620000 },
  { label: '2023', value: 780000 },
  { label: '2024', value: 520000 },
]

// Dữ liệu hiện tại cho biểu đồ doanh thu
const revenueData = ref(monthlyRevenueData)

// Dữ liệu cho biểu đồ danh mục sản phẩm
const categoryData = ref({
  electronics: 32,
  clothing: 28,
  home: 18,
  beauty: 12,
  sports: 10,
})

// Dữ liệu cho biểu đồ trạng thái đơn hàng
const orderStatusData = ref({
  completed: 68,
  processing: 17,
  shipped: 12,
  cancelled: 3,
})

// Dữ liệu cho top sản phẩm bán chạy
const topProducts = ref([
  {
    id: 'p001',
    name: 'Smartphone X Pro',
    category: 'Electronics',
    price: 499.99,
    sales: 245,
    revenue: 122500,
    growth: 12.5,
    stock: 78,
    rating: 4.8,
    image: 'https://placehold.co/100x100/3b82f6/FFFFFF.png?text=Phone',
  },
  {
    id: 'p002',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 149.99,
    sales: 189,
    revenue: 28350,
    growth: 8.2,
    stock: 124,
    rating: 4.5,
    image: 'https://placehold.co/100x100/10b981/FFFFFF.png?text=Audio',
  },
  {
    id: 'p003',
    name: 'Laptop Ultra',
    category: 'Electronics',
    price: 1099.99,
    sales: 142,
    revenue: 156200,
    growth: -3.5,
    stock: 32,
    rating: 4.2,
    image: 'https://placehold.co/100x100/6366f1/FFFFFF.png?text=Laptop',
  },
  {
    id: 'p004',
    name: 'Smart Watch',
    category: 'Wearables',
    price: 199.99,
    sales: 136,
    revenue: 27200,
    growth: 15.8,
    stock: 65,
    rating: 4.6,
    image: 'https://placehold.co/100x100/ec4899/FFFFFF.png?text=Watch',
  },
  {
    id: 'p005',
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 149.99,
    sales: 124,
    revenue: 18600,
    growth: 5.4,
    stock: 89,
    rating: 4.3,
    image: 'https://placehold.co/100x100/f59e0b/FFFFFF.png?text=Speaker',
  },
])

// Cấu hình biểu đồ đường cho doanh thu
const revenueChartData = computed(() => ({
  labels: revenueData.value.map((item) => item.label),
  datasets: [
    {
      label: 'Revenue',
      data: revenueData.value.map((item) => item.value),
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

// Cấu hình biểu đồ tròn cho danh mục sản phẩm
const categoryChartData = computed(() => ({
  labels: ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'],
  datasets: [
    {
      data: [
        categoryData.value.electronics,
        categoryData.value.clothing,
        categoryData.value.home,
        categoryData.value.beauty,
        categoryData.value.sports,
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)', // Electronics - Blue
        'rgba(255, 99, 132, 0.8)', // Clothing - Red
        'rgba(255, 206, 86, 0.8)', // Home - Yellow
        'rgba(75, 192, 192, 0.8)', // Beauty - Green
        'rgba(153, 102, 255, 0.8)', // Sports - Purple
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
}))

// Cấu hình biểu đồ tròn cho trạng thái đơn hàng
const orderStatusChartData = computed(() => ({
  labels: ['Completed', 'Processing', 'Shipped', 'Cancelled'],
  datasets: [
    {
      data: [
        orderStatusData.value.completed,
        orderStatusData.value.processing,
        orderStatusData.value.shipped,
        orderStatusData.value.cancelled,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)', // Completed - Green
        'rgba(255, 206, 86, 0.8)', // Processing - Yellow
        'rgba(54, 162, 235, 0.8)', // Shipped - Blue
        'rgba(255, 99, 132, 0.8)', // Cancelled - Red
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
}))

// Cấu hình options cho biểu đồ
const chartOptions: any = {
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
        label: function (tooltipItem: any) {
          const label = tooltipItem.label || ''
          const value = tooltipItem.raw || 0
          const total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value} (${percentage}%)`
        },
      },
    },
  },
}

// Cấu hình options cho biểu đồ doanh thu
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
          return `Revenue: $${formatNumber(tooltipItem.raw)}`
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
          return '$' + formatNumber(value)
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

// Format number with thousands separator
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Update stats based on selected time period
const updateStats = () => {
  // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu mới dựa trên khoảng thời gian
  // Đây là dữ liệu mẫu cho mục đích demo
  switch (timePeriod.value) {
    case 'daily':
      totalRevenue.value = 4580
      totalOrders.value = 45
      averageOrderValue.value = 101.78
      conversionRate.value = 2.8
      revenueData.value = dailyRevenueData
      break
    case 'weekly':
      totalRevenue.value = 39800
      totalOrders.value = 385
      averageOrderValue.value = 103.38
      conversionRate.value = 3.0
      revenueData.value = weeklyRevenueData
      break
    case 'monthly':
      totalRevenue.value = 124580
      totalOrders.value = 1245
      averageOrderValue.value = 100.06
      conversionRate.value = 3.2
      revenueData.value = monthlyRevenueData
      break
    case 'yearly':
      totalRevenue.value = 1458000
      totalOrders.value = 14250
      averageOrderValue.value = 102.32
      conversionRate.value = 3.5
      revenueData.value = yearlyRevenueData
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
      <h2 class="text-xl font-semibold">E-commerce Overview</h2>
      <Tabs v-model="timePeriod" @update:modelValue="updateStats" class="w-auto">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <!-- Inventory Status -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="flex items-center p-4 border rounded-lg bg-white shadow-sm">
        <div class="mr-4 bg-blue-100 p-3 rounded-full">
          <LucidePackage class="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <div class="text-sm text-muted-foreground">Total Products</div>
          <div class="text-2xl font-bold">{{ formatNumber(totalProducts) }}</div>
        </div>
      </div>

      <div class="flex items-center p-4 border rounded-lg bg-white shadow-sm">
        <div class="mr-4 bg-yellow-100 p-3 rounded-full">
          <LucideBarChart class="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <div class="text-sm text-muted-foreground">Low Stock</div>
          <div class="text-2xl font-bold">{{ lowStockProducts }}</div>
        </div>
      </div>

      <div class="flex items-center p-4 border rounded-lg bg-white shadow-sm">
        <div class="mr-4 bg-red-100 p-3 rounded-full">
          <LucideTruck class="h-6 w-6 text-red-600" />
        </div>
        <div>
          <div class="text-sm text-muted-foreground">Out of Stock</div>
          <div class="text-2xl font-bold">{{ outOfStockProducts }}</div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Revenue -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
          <LucideDollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">${{ formatNumber(totalRevenue) }}</div>
            <div class="flex items-center text-green-500 text-xs">
              <LucideArrowUpRight class="h-3 w-3 mr-1" />
              <span>8.2%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Compared to last period</p>
        </CardContent>
      </Card>

      <!-- Total Orders -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Orders</CardTitle>
          <LucideShoppingCart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ formatNumber(totalOrders) }}</div>
            <div class="flex items-center text-green-500 text-xs">
              <LucideArrowUpRight class="h-3 w-3 mr-1" />
              <span>5.4%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Compared to last period</p>
        </CardContent>
      </Card>

      <!-- Average Order Value -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Average Order Value</CardTitle>
          <LucideShoppingBag class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">${{ averageOrderValue.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">Per order average</p>
        </CardContent>
      </Card>

      <!-- Conversion Rate -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Conversion Rate</CardTitle>
          <LucidePercent class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="flex items-baseline space-x-2">
            <div class="text-2xl font-bold">{{ conversionRate }}%</div>
            <div class="flex items-center text-red-500 text-xs">
              <LucideArrowDownRight class="h-3 w-3 mr-1" />
              <span>0.8%</span>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Visitors who made a purchase</p>
        </CardContent>
      </Card>
    </div>

    <!-- Revenue Chart and Product Categories -->
    <div class="grid gap-6 md:grid-cols-7">
      <!-- Revenue Chart -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Revenue trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] w-full">
            <Line :data="revenueChartData" :options="lineChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Product Categories -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
          <CardDescription>Sales by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-64 w-full">
            <Pie :data="categoryChartData" :options="chartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Top Products and Order Status -->
    <div class="grid gap-6 md:grid-cols-7">
      <!-- Top Products -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products</CardDescription>
        </CardHeader>
        <CardContent class="p-2">
          <div class="space-y-2">
            <div
              v-for="product in topProducts"
              :key="product.id"
              class="flex items-center justify-between py-2 px-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-8 h-8 rounded-md object-cover"
                />
                <div>
                  <div class="flex items-center gap-1">
                    <router-link
                      :to="`/product/${product.id}`"
                      class="text-sm font-medium hover:text-primary hover:underline"
                      >{{ product.name }}</router-link
                    >
                    <span class="text-xs text-yellow-500">★ {{ product.rating }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <router-link
                      :to="`/category/${product.category.toLowerCase()}`"
                      class="text-xs text-blue-600 hover:underline"
                      >{{ product.category }}</router-link
                    >
                    <span class="text-xs text-muted-foreground">${{ product.price }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <div class="hidden md:flex flex-col items-end">
                  <span class="text-xs text-muted-foreground">Sales</span>
                  <span class="font-medium">{{ product.sales }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-xs text-muted-foreground">Revenue</span>
                  <span class="font-medium">${{ formatNumber(product.revenue) }}</span>
                </div>
                <div class="hidden md:flex flex-col items-end">
                  <span class="text-xs text-muted-foreground">Stock</span>
                  <span class="font-medium">{{ product.stock }}</span>
                </div>
                <div class="flex items-center ml-2">
                  <LucideArrowUpRight
                    v-if="product.growth > 0"
                    class="h-3 w-3 mr-0.5 text-green-500"
                  />
                  <LucideArrowDownRight v-else class="h-3 w-3 mr-0.5 text-red-500" />
                  <span
                    :class="product.growth > 0 ? 'text-green-500' : 'text-red-500'"
                    class="text-xs font-medium"
                  >
                    {{ Math.abs(product.growth) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Order Status -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Distribution of order statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-64 w-full">
            <Pie :data="orderStatusChartData" :options="chartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Kết thúc trang -->
    <div class="h-4"></div>
  </div>
</template>
