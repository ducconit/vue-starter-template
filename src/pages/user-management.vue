<script setup lang="ts">
import { ref, computed, h } from 'vue'
import dayjs from 'dayjs'
import {
  Download,
  Upload,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronDown,
  FileDown,
  Plus,
  Search,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FlexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ExpandedState,
  getExpandedRowModel,
  type ColumnDef,
} from '@tanstack/vue-table'
import { valueUpdater } from '@/components/ui/table/utils'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Utility functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

// User interface definition
interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  avatar: string
}

// User status options
const statusOptions = [
  { value: ' ', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Suspended', label: 'Suspended' },
]

// User role options
const roleOptions = [
  { value: ' ', label: 'All Roles' },
  { value: 'Admin', label: 'Administrator' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Editor', label: 'Editor' },
  { value: 'User', label: 'User' },
]

// Sample user data
const users = ref<User[]>([
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-05-04T10:30:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nguyễn%20Văn%20A',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-05-03T15:45:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trần%20Thị%20B',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    role: 'Editor',
    status: 'Inactive',
    lastLogin: '2025-04-28T09:15:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lê%20Văn%20C',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    role: 'User',
    status: 'Pending',
    lastLogin: '2025-05-01T14:20:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phạm%20Thị%20D',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2025-05-02T11:10:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoàng%20Văn%20E',
  },
  {
    id: 6,
    name: 'Đỗ Thị F',
    email: 'dothif@example.com',
    role: 'User',
    status: 'Suspended',
    lastLogin: '2025-04-25T08:30:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Đỗ%20Thị%20F',
  },
  {
    id: 7,
    name: 'Vũ Văn G',
    email: 'vuvang@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2025-05-03T13:20:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vũ%20Văn%20G',
  },
  {
    id: 8,
    name: 'Ngô Thị H',
    email: 'ngothih@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2025-05-01T15:40:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngô%20Thị%20H',
  },
  {
    id: 9,
    name: 'Đặng Văn I',
    email: 'dangvani@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2025-04-20T10:05:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Đặng%20Văn%20I',
  },
  {
    id: 10,
    name: 'Bùi Thị K',
    email: 'buithik@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-05-04T09:50:00',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bùi%20Thị%20K',
  },
])

// Search and filter state
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Filter users by search and filters
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      searchQuery.value === '' ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = selectedRole.value === '' || user.role === selectedRole.value
    const matchesStatus = selectedStatus.value === '' || user.status === selectedStatus.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Show delete confirmation dialog
const showDeleteConfirm = (userId: number) => {
  userToDelete.value = userId
  isDeleteDialogOpen.value = true
}

// Handle user deletion
const deleteUser = () => {
  if (userToDelete.value) {
    // Tìm và xóa người dùng theo ID
    users.value = users.value.filter((user) => user.id !== userToDelete.value)
    console.log('Deleted user with ID:', userToDelete.value)
    
    // Reset state và đóng dialog
    userToDelete.value = null
    isDeleteDialogOpen.value = false
  } else {
    console.error('No user selected for deletion')
  }
}

// Handle data export
const exportData = (type = '') => {
  console.log(`Export data ${type}:`, filteredUsers.value)
  // Implement data export (CSV, Excel,...)
}

// Import dialog state
const isImportDialogOpen = ref(false)
const importFile = ref<File | null>(null)
const importError = ref('')

// Delete confirmation dialog state
const isDeleteDialogOpen = ref(false)
const userToDelete = ref<number | null>(null)

// Handle data import
const importData = () => {
  isImportDialogOpen.value = true
}

// Handle template download
const downloadTemplate = () => {
  // Tạo dữ liệu mẫu
  const csvContent =
    'name,email,role,status\nJohn Doe,johndoe@example.com,Admin,Active\nJane Smith,janesmith@example.com,Editor,Active\nRobert Johnson,robertj@example.com,User,Pending'

  // Tạo blob và download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'user-import-template.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Handle file selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    importFile.value = target.files[0]
    importError.value = ''
  }
}

// Process import file
const processImport = () => {
  if (!importFile.value) {
    importError.value = 'Please select a file to import'
    return
  }

  // Here you would process the file (CSV, Excel, etc.)
  // For demonstration, we'll just log the file info
  console.log('Processing import file:', importFile.value.name)

  // Reset and close dialog
  importFile.value = null
  isImportDialogOpen.value = false
}

// TanStack Table configuration
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['User', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h(
          Avatar,
          { class: 'h-9 w-9' },
          {
            default: () => [
              h(AvatarImage, { src: user.avatar, alt: user.name }),
              h(AvatarFallback, {}, getInitials(user.name)),
            ],
          },
        ),
        h('div', { class: 'font-medium' }, user.name),
      ])
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', {}, row.getValue('email')),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Role', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const role = row.getValue('role')
      return h(Badge, { variant: 'outline' }, () => role)
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Status', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const status = row.getValue('status')
      return h(
        Badge,
        {
          variant:
            status === 'Active' ? 'default' : status === 'Inactive' ? 'destructive' : 'secondary',
        },
        () => status,
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Last Login', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('lastLogin') as string
      return dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center justify-end gap-2' }, [
        h(
          Tooltip,
          {},
          {
            default: () => [
              h(TooltipTrigger, { asChild: true }, [
                h(
                  'a',
                  {
                    href: `#/user-management/edit/${user.id}`,
                    class:
                      'inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                  },
                  [h(Edit, { class: 'h-4 w-4' }), h('span', { class: 'sr-only' }, 'Edit')],
                ),
              ]),
              h(TooltipContent, {}, [h('p', {}, 'Edit')]),
            ],
          },
        ),
        h(
          Tooltip,
          {},
          {
            default: () => [
              h(TooltipTrigger, { asChild: true }, [
                h(
                  Button,
                  {
                    variant: 'ghost',
                    size: 'icon',
                    onClick: () => showDeleteConfirm(user.id),
                  },
                  [h(Trash2, { class: 'h-4 w-4' }), h('span', { class: 'sr-only' }, 'Delete')],
                ),
              ]),
              h(TooltipContent, {}, [h('p', {}, 'Delete')]),
            ],
          },
        ),
      ])
    },
    enableSorting: false,
    enableHiding: false,
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  data: users.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
  },
})
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <div class="flex gap-2">
        <Button variant="outline" @click="importData">
          <Upload class="mr-2 h-4 w-4" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download class="mr-2 h-4 w-4" />
              Export
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem @click="exportData('csv')">Export as CSV</DropdownMenuItem>
            <DropdownMenuItem @click="exportData('excel')">Export as Excel</DropdownMenuItem>
            <DropdownMenuItem @click="exportData('pdf')">Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <!-- Import Dialog -->
      <Dialog v-model:open="isImportDialogOpen">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file containing user data.
            </DialogDescription>
          </DialogHeader>

          <div class="grid gap-4 py-4">
            <div class="flex flex-col gap-2">
              <label for="file-upload" class="text-sm font-medium">File</label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                @change="handleFileChange"
              />
              <p v-if="importError" class="text-sm text-red-500">{{ importError }}</p>
              <p v-if="importFile" class="text-sm text-green-600">
                Selected: {{ importFile.name }}
              </p>
              <div class="text-sm text-muted-foreground mt-2">
                <a
                  href="javascript:void(0)"
                  class="text-primary hover:underline flex items-center gap-1"
                  @click="downloadTemplate"
                >
                  <FileDown class="h-3 w-3" />
                  Download sample template
                </a>
                <p class="mt-1 text-xs">
                  The file should contain columns: name, email, role, status
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" @click="isImportDialogOpen = false"> Cancel </Button>
            <Button @click="processImport"> Import </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Delete Confirmation Dialog -->
      <Dialog v-model:open="isDeleteDialogOpen">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter class="mt-4">
            <Button variant="outline" @click="isDeleteDialogOpen = false"> Cancel </Button>
            <Button variant="destructive" @click="deleteUser"> Delete </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Filters and search -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div class="flex gap-4 flex-grow">
        <div class="relative w-full max-w-sm items-center">
          <Input
            :model-value="table.getColumn('email')?.getFilterValue() as string"
            @update:model-value="table.getColumn('email')?.setFilterValue($event)"
            type="text"
            placeholder="Search by name, email..."
            class="pl-10"
          />
          <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
            <Search class="size-4 text-muted-foreground -mt-1" />
          </span>
        </div>

        <Select
          :model-value="table.getColumn('role')?.getFilterValue() as string"
          @update:model-value="table.getColumn('role')?.setFilterValue($event)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          :model-value="table.getColumn('status')?.getFilterValue() as string"
          @update:model-value="table.getColumn('status')?.setFilterValue($event)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <!-- Column visibility dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="
              (value) => {
                column.toggleVisibility(!!value)
              }
            "
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              :class="
                cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                )
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="
                    cn(
                      { 'sticky bg-background/95': cell.column.getIsPinned() },
                      cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                    )
                  "
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ row.original }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
