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
        <!-- <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template> -->
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
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="currentSupplier.address" />
        </el-form-item>
        <!-- <el-form-item label="评分" prop="rating">
          <el-rate v-model="currentSupplier.rating" :max="10" show-score allow-half />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import SupplierCard from "@/components/SupplierCard.vue"
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addSupplierService,
  getSupplierService,
  updateSupplierService,
  deleteSupplierService,
  getSupplierNameService
} from '@/api/supplier.js'
import { number } from 'echarts'

// 数据状态
const suppliers = ref([])
const searchKey = ref('')
const isSearch = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const loading = ref(false) // 加载状态

const currentSupplier = reactive({
  name: '',
  contact: '',
  address: '', 
})

const rules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }], // 新增验证
  rating: [
    { required: true, message: '请输入供应商评分', trigger: 'blur' },
    { type: 'number', message: '请输入有效的评分值', trigger: 'blur' },
    { min: 8.0, max: 10.0, message: '评分范围为8.0-10.0', trigger: 'blur' }
  ]
}

// 计算属性过滤供应商
const filteredSuppliers = computed(() => {
  return suppliers.value.filter(item => 
    item.name.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

// 生命周期钩子
onMounted(() => {
  loadSuppliers()
})

// 数据加载
const loadSuppliers = async () => {
  loading.value = true
  try {
    if (isSearch.value && searchKey.value) {
      const res = await getSupplierNameService(searchKey.value)
      suppliers.value = res.data
    } else {
      const res = await getSupplierService()
      suppliers.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载供应商数据失败')
  } finally {
    loading.value = false
  }
}

// 操作方法
const handleSearch = () => {
  isSearch.value = true
  loadSuppliers()
}

const handleAdd = () => {
  isEdit.value = false
  
  Object.assign(currentSupplier, {
    name: '',
    contact: '',
    address: ''
  })
  dialogVisible.value = true
}

const handleEdit = (supplier) => {
  isEdit.value = true
  Object.assign(currentSupplier, {
    id: supplier.id,
    name: supplier.name,
    contact: supplier.contact,
    address: supplier.address, // 获取现有地址
    rating: supplier.rating
  })
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该供应商吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteSupplierService(id)
    suppliers.value = suppliers.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      await updateSupplierService(currentSupplier)
      ElMessage.success('更新成功')
    } else {
      await addSupplierService(currentSupplier)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    await loadSuppliers()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
  }
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