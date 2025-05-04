<script setup lang="ts">
import { ref, computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  ArrowDownRight,
  ArrowUpRight,
  Bitcoin,
  DollarSign,
  LineChart,
  Wallet,
} from 'lucide-vue-next'

// Đăng ký các thành phần ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// No longer needed, using formatCurrency instead

// Hàm định dạng tiền tệ
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Dữ liệu thống kê tổng quan
const portfolioValue = ref(38642.75)
const portfolioChange = ref(5.25)
const totalCoins = ref(12)
const totalTransactions = ref(156)

// Dữ liệu tiền điện tử
const cryptoAssets = ref([
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.65,
    change24h: 2.34,
    amount: 0.45,
    value: 19462.79,
    color: '#F7931A',
    icon: Bitcoin,
    history: [42100, 42300, 42900, 43100, 42800, 43250, 43300],
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3120.42,
    change24h: -1.25,
    amount: 3.2,
    value: 9985.34,
    color: '#627EEA',
    icon: Wallet,
    history: [3050, 3080, 3150, 3100, 3090, 3120, 3110],
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: 102.75,
    change24h: 5.67,
    amount: 45.5,
    value: 4675.12,
    color: '#00FFA3',
    icon: LineChart,
    history: [95, 97, 99, 100, 101, 103, 102.75],
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    change24h: 0.01,
    amount: 4520,
    value: 4520.00,
    color: '#26A17B',
    icon: DollarSign,
    history: [1, 1, 1, 1, 1, 1, 1],
  },
])

// Dữ liệu lịch sử giá Bitcoin
const timeLabels = ['1 May', '2 May', '3 May', '4 May', '5 May', '6 May', '7 May']
const bitcoinPriceHistory = [42100, 42300, 42900, 43100, 42800, 43250, 43300]
const ethereumPriceHistory = [3050, 3080, 3150, 3100, 3090, 3120, 3110]
const solanaHistory = [95, 97, 99, 100, 101, 103, 102.75]

// Dữ liệu khối lượng giao dịch
const volumeData = [
  { date: '1 May', btc: 1200, eth: 3500, sol: 5200 },
  { date: '2 May', btc: 1350, eth: 3200, sol: 4800 },
  { date: '3 May', btc: 1500, eth: 3800, sol: 5500 },
  { date: '4 May', btc: 1420, eth: 3600, sol: 5100 },
  { date: '5 May', btc: 1380, eth: 3400, sol: 4900 },
  { date: '6 May', btc: 1450, eth: 3700, sol: 5300 },
  { date: '7 May', btc: 1500, eth: 3900, sol: 5600 },
]

// Dữ liệu phân bổ danh mục đầu tư
const portfolioAllocation = computed(() => {
  const total = cryptoAssets.value.reduce((sum, asset) => sum + asset.value, 0)
  return cryptoAssets.value.map(asset => ({
    ...asset,
    percentage: (asset.value / total) * 100
  }))
})

// Dữ liệu lịch sử giao dịch
const recentTransactions = ref([
  { id: 'tx1', type: 'buy', coin: 'Bitcoin', symbol: 'BTC', amount: 0.05, price: 43100, date: '2025-05-04', status: 'completed' },
  { id: 'tx2', type: 'sell', coin: 'Ethereum', symbol: 'ETH', amount: 1.2, price: 3150, date: '2025-05-03', status: 'completed' },
  { id: 'tx3', type: 'buy', coin: 'Solana', symbol: 'SOL', amount: 10, price: 101, date: '2025-05-02', status: 'completed' },
  { id: 'tx4', type: 'transfer', coin: 'Bitcoin', symbol: 'BTC', amount: 0.02, price: 42900, date: '2025-05-01', status: 'completed' },
  { id: 'tx5', type: 'buy', coin: 'Tether', symbol: 'USDT', amount: 500, price: 1, date: '2025-04-30', status: 'completed' },
])

// Cấu hình biểu đồ đường
const priceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: $${context.raw.toLocaleString()}`
        }
      }
    }
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
}

// Dữ liệu biểu đồ giá
const priceChartData = computed(() => ({
  labels: timeLabels,
  datasets: [
    {
      label: 'Bitcoin',
      data: bitcoinPriceHistory,
      borderColor: '#F7931A',
      backgroundColor: 'rgba(247, 147, 26, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Ethereum',
      data: ethereumPriceHistory,
      borderColor: '#627EEA',
      backgroundColor: 'rgba(98, 126, 234, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
    {
      label: 'Solana',
      data: solanaHistory,
      borderColor: '#00FFA3',
      backgroundColor: 'rgba(0, 255, 163, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
  ],
}))

// Dữ liệu biểu đồ khối lượng
const volumeChartData = computed(() => ({
  labels: volumeData.map(item => item.date),
  datasets: [
    {
      label: 'Bitcoin',
      data: volumeData.map(item => item.btc),
      backgroundColor: 'rgba(247, 147, 26, 0.7)',
    },
    {
      label: 'Ethereum',
      data: volumeData.map(item => item.eth),
      backgroundColor: 'rgba(98, 126, 234, 0.7)',
    },
    {
      label: 'Solana',
      data: volumeData.map(item => item.sol),
      backgroundColor: 'rgba(0, 255, 163, 0.7)',
    },
  ],
}))

// Cấu hình biểu đồ khối lượng
const volumeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.1)',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${context.raw.toLocaleString()} transactions`
        }
      }
    }
  },
}

// Thời gian hiển thị
const timeframe = ref('7d')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold tracking-tight">Crypto Dashboard</h1>
    <p class="text-muted-foreground">Track your portfolio and cryptocurrency market</p>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mt-4 mb-6">
      <Tabs v-model="timeframe" class="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="24h">24h</TabsTrigger>
          <TabsTrigger value="7d">7D</TabsTrigger>
          <TabsTrigger value="30d">30D</TabsTrigger>
          <TabsTrigger value="90d">90D</TabsTrigger>
          <TabsTrigger value="1y">1Y</TabsTrigger>
        </TabsList>
      </Tabs>

      <div class="hidden sm:flex items-center gap-2">
        <Select defaultValue="usd">
          <SelectTrigger class="w-[120px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="gbp">GBP</SelectItem>
            <SelectItem value="jpy">JPY</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Overview Statistics -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Value</CardTitle>
          <Wallet class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(portfolioValue) }}</div>
          <div class="flex items-center pt-1">
            <ArrowUpRight v-if="portfolioChange > 0" class="h-4 w-4 mr-1 text-green-500" />
            <ArrowDownRight v-else class="h-4 w-4 mr-1 text-red-500" />
            <span :class="portfolioChange > 0 ? 'text-green-500' : 'text-red-500'" class="text-xs">
              {{ Math.abs(portfolioChange) }}%
            </span>
            <span class="text-xs text-muted-foreground ml-1">vs 24h ago</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Bitcoin</CardTitle>
          <Bitcoin class="h-4 w-4 text-[#F7931A]" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(cryptoAssets[0].price) }}</div>
          <div class="flex items-center pt-1">
            <ArrowUpRight v-if="cryptoAssets[0].change24h > 0" class="h-4 w-4 mr-1 text-green-500" />
            <ArrowDownRight v-else class="h-4 w-4 mr-1 text-red-500" />
            <span :class="cryptoAssets[0].change24h > 0 ? 'text-green-500' : 'text-red-500'" class="text-xs">
              {{ Math.abs(cryptoAssets[0].change24h) }}%
            </span>
            <span class="text-xs text-muted-foreground ml-1">24h</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Coins</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalCoins }}</div>
          <p class="text-xs text-muted-foreground pt-1">In portfolio</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Transactions</CardTitle>
          <LineChart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ totalTransactions }}</div>
          <p class="text-xs text-muted-foreground pt-1">Total transactions</p>
        </CardContent>
      </Card>
    </div>

    <!-- Price Chart -->
    <div class="grid gap-4 mt-4 md:grid-cols-7">
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
          <CardDescription>Track price movements of major cryptocurrencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] w-full">
            <Line :data="priceChartData" :options="priceChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Portfolio -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>Asset allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="asset in portfolioAllocation" :key="asset.id" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full" :style="`background-color: ${asset.color}25`">
                  <component :is="asset.icon" class="h-4 w-4" :style="`color: ${asset.color}`" />
                </div>
                <div>
                  <router-link :to="`/crypto/${asset.id}`" class="text-sm font-medium hover:underline">
                    {{ asset.name }}
                  </router-link>
                  <div class="flex items-center text-xs text-muted-foreground">
                    {{ asset.amount }} {{ asset.symbol }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div class="text-sm font-medium">{{ formatCurrency(asset.value) }}</div>
                <div class="flex items-center text-xs">
                  <span class="text-muted-foreground">{{ asset.percentage.toFixed(1) }}%</span>
                  <div class="ml-2 flex items-center">
                    <ArrowUpRight v-if="asset.change24h > 0" class="h-3 w-3 mr-0.5 text-green-500" />
                    <ArrowDownRight v-else class="h-3 w-3 mr-0.5 text-red-500" />
                    <span :class="asset.change24h > 0 ? 'text-green-500' : 'text-red-500'">
                      {{ Math.abs(asset.change24h) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Trading Volume and Recent Transactions -->
    <div class="grid gap-4 mt-4 md:grid-cols-7">
      <!-- Trading Volume -->
      <Card class="md:col-span-4">
        <CardHeader>
          <CardTitle>Trading Volume</CardTitle>
          <CardDescription>Daily trading volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] w-full">
            <Bar :data="volumeChartData" :options="volumeChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Recent Transactions -->
      <Card class="md:col-span-3">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="tx in recentTransactions" :key="tx.id" class="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full" 
                     :class="tx.type === 'buy' ? 'bg-green-100' : tx.type === 'sell' ? 'bg-red-100' : 'bg-blue-100'">
                  <ArrowUpRight v-if="tx.type === 'buy'" class="h-4 w-4 text-green-500" />
                  <ArrowDownRight v-if="tx.type === 'sell'" class="h-4 w-4 text-red-500" />
                  <Wallet v-if="tx.type === 'transfer'" class="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div class="text-sm font-medium">
                    {{ tx.type === 'buy' ? 'Buy' : tx.type === 'sell' ? 'Sell' : 'Transfer' }} {{ tx.coin }}
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ new Date(tx.date).toLocaleDateString('en-US') }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <div class="text-sm font-medium">
                  {{ tx.amount }} {{ tx.symbol }}
                </div>
                <div class="text-xs text-muted-foreground">
                  {{ formatCurrency(tx.price * tx.amount) }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <router-link to="/transactions" class="text-sm text-primary hover:underline">View all transactions</router-link>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
