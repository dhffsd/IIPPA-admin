<template>
  <div class="supplier-management">
    <!-- 搜索和添加区域 -->
    <div class="operation-bar">
      <el-input
        v-model="searchKey"
        placeholder="输入供应商名称搜索"
        clearable
        style="width: 300px"
        @clear="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增供应商</el-button>
    </div>

    <!-- 供应商卡片列表 -->
    <div class="supplier-list">
      <supplier-card
        v-for="supplier in filteredSuppliers"
        :key="supplier.id"
        :supplier="supplier"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- 编辑/添加对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑供应商' : '新增供应商'">
      <el-form :model="currentSupplier" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="currentSupplier.name" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="currentSupplier.contact" />
        </el-form-item>
        <el-form-item label="评分" prop="rating">
          <el-rate v-model="currentSupplier.rating" :max="10" show-score allow-half />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import SupplierCard from "@/components/SupplierCard.vue"

// 模拟数据
const suppliers = ref([
  {
    id: 1,
    name: '优质材料供应商',
    rating: 4.5,
    contact: '138-1234-5678',
    address: '上海市浦东新区'
  },
  {
    id: 2,
    name: '快速物流供应商',
    rating: 4.8,
    contact: '400-800-1234',
    address: '北京市朝阳区'
  },
  // 更多数据...
])

const searchKey = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const currentSupplier = reactive({
  id: null,
  name: '',
  contact: '',
  rating: 0
})

const rules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
}

// 计算属性过滤供应商
const filteredSuppliers = computed(() => {
  return suppliers.value.filter(item => 
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

const handleSearch = () => {
  // 实际项目中这里可以调用API
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(currentSupplier, {
    id: null,
    name: '',
    contact: '',
    rating: 0
  })
  dialogVisible.value = true
}

const handleEdit = (supplier) => {
  isEdit.value = true
  Object.assign(currentSupplier, {...supplier})
  dialogVisible.value = true
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该供应商吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    suppliers.value = suppliers.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
  })
}

const submitForm = async () => {
  await formRef.value.validate()
  if (isEdit.value) {
    const index = suppliers.value.findIndex(item => item.id === currentSupplier.id)
    suppliers.value.splice(index, 1, {...currentSupplier})
  } else {
    suppliers.value.push({
      ...currentSupplier,
      id: Date.now()
    })
  }
  dialogVisible.value = false
  ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
}
</script>

<style scoped>
.supplier-management {
  padding: 20px;
}

.operation-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.supplier-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 10px;
}
</style>