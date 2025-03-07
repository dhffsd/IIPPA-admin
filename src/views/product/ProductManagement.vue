<template>
    <el-card class="page-container">
      <template #header>
        <div class="header">
          <span>商品管理</span>
          <el-button type="primary" @click="showAddDialog" auto-insert-space>新增商品</el-button>
        </div>
      </template>
  
      <!-- 搜索区域 -->
      <el-form :model="searchForm" ref="searchFormRef" inline>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="商品分类" prop="category" >
          <el-select v-model="searchForm.category" placeholder="全部分类" style="width: 100px" clearable>
            <el-option 
              v-for="c in categorys" 
              :key="c" 
              :label="c" 
              :value="c" 
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
  
      <!-- 数据表格 -->
      <el-table :data="products" v-loading="loading" border stripe>
        <el-table-column prop="imageUrl" label="封面" width="120">
          <template #default="{row}">
            <img :src="row.imageUrl" class="table-image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="160" />
        <el-table-column prop="description" label="商品描述" min-width="240" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="140" />
        <el-table-column prop="createdTime" label="创建时间" width="180">
            <template #default="{row}">
                {{ formatTime(row.createdTime) }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{row}">
            <el-button 
              type="primary" 
              size="small" 
              :icon="Edit" 
              @click="handleEdit(row.id)" 
            />
            <el-button 
              type="danger" 
              size="small" 
              :icon="Delete" 
              @click="handleDelete(row.id)" 
            />
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
  
      <!-- 编辑抽屉 -->
      <el-drawer 
        v-model="visibleDrawer" 
        :title="isEditMode ? '编辑商品' : '新增商品'" 
        size="40%"
      >
        <el-form 
          :model="productModel" 
          ref="productFormRef" 
          label-width="80px" 
          :rules="rules"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="productModel.name" placeholder="请输入名称" />
          </el-form-item>
  
          <el-form-item label="商品分类" prop="category">
            <el-select 
              v-model="productModel.category" 
              placeholder="请选择分类"
              style="width: 100%"
            >
              <el-option 
                v-for="c in categorys" 
                :key="c" 
                :label="c" 
                :value="c" 
              />
            </el-select>
          </el-form-item>
  
          <el-form-item label="商品封面">
            <el-input v-model="productModel.imageUrl" placeholder="图片URL" />
            <div class="tip">建议尺寸：800x600px，支持JPG/PNG格式</div>
          </el-form-item>
  
          <el-form-item label="商品描述" prop="description">
            <div class="quill-wrapper">
                <QuillEditor 
                v-model:content="productModel.description" 
                contentType="html"
                theme="snow" 
                :options="{
                    modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ list: 'ordered' }, { list: 'bullet' }]
                    ]
                    }
                }"
                />
            </div>
            </el-form-item>
  
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="visibleDrawer = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </el-card>
  </template>
  
<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { QuillEditor } from '@vueup/vue-quill';
  import dayjs from 'dayjs'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import {
    addProductService,
    updateProductService,
    deleteProductService,
    getProductService,
    getAllProductService
  } from '@/api/product.js';
  
  // 数据状态
  const categorys = ref([]);
  const products = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const visibleDrawer = ref(false);
  const pageNum = ref(1);
  const pageSize = ref(10);
  const isEditMode = ref(false);
  


// 添加格式化方法
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}


  // 表单相关
  const searchForm = reactive({
    name: '',
    category: ''
  });
  
  const productModel = reactive({
    id: '',
    name: '',
    category: '',
    imageUrl: '',
    description: ''
  });
  
  const rules = {
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
    description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
  };
  
  const searchFormRef = ref();
  const productFormRef = ref();
  
  // 生命周期
  onMounted(() => {
    loadProducts();
  });
  
  // 数据加载 ==============================================
  // 修改后的数据加载
const loadProducts = async () => {
  loading.value = true;
  try {
    const params = {
      page: pageNum.value,
      size: pageSize.value,
      name: searchForm.name,     // 添加搜索参数
      category: searchForm.category
    };
    
    const res = await getAllProductService(params);
    products.value = res.data.items;
    total.value = res.data.total;

    // 动态提取分类
    const allCategories = res.data.items.map(item => item.category);
    categorys.value = [...new Set(allCategories)]; // 去重处理
  } catch (err) {
    ElMessage.error('数据加载失败');
  } finally {
    loading.value = false;
  }
};

  
  // 搜索和分页 ============================================
  const handleSearch = () => {
    pageNum.value = 1;
    loadProducts();
  };
  
  const resetSearch = () => {
    searchFormRef.value.resetFields();
    handleSearch();
  };
  
  const onSizeChange = (size) => {
    pageSize.value = size;
    loadProducts();
  };
  
  const onCurrentChange = (page) => {
    pageNum.value = page;
    loadProducts();
  };
  
  // 商品操作 ==============================================
  const showAddDialog = () => {
    isEditMode.value = false;
    resetForm();
    visibleDrawer.value = true;
  };
  
  const handleEdit = async (id) => {
    try {
      const res = await getProductService({ id });
      Object.assign(productModel, res.data);
      isEditMode.value = true;
      visibleDrawer.value = true;
    } catch (err) {
      ElMessage.error('数据获取失败');
    }
  };
  
  const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除该商品吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        
        await deleteProductService(id);

        ElMessage.success('删除成功');
        loadProducts();
      } catch (err) {
        ElMessage.error('删除失败');
      }
    }).catch(() => {});
  };
  
  const submitForm = async () => {
    await productFormRef.value.validate();
    
    try {
      if (isEditMode.value) {
        await updateProductService(productModel);
        ElMessage.success('更新成功');
      } else {
        await addProductService(productModel);
        
        ElMessage.success('添加成功');
      }
      visibleDrawer.value = false;
      loadProducts();
    } catch (err) {
      ElMessage.error(isEditMode.value ? '更新失败' : '添加失败');
    }
  };
  
  // 工具方法 ==============================================
  const resetForm = () => {
    productFormRef.value?.resetFields();
    productModel.id = '';
    productModel.imageUrl = '';
  };
  
  const uploadSuccess = (res) => {
    productModel.imageUrl = res.data.url;
  };
</script>
  
<style scoped>
  .table-image {
    width: 80px;
    height: 60px;
    object-fit: cover;
  }
  
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  :deep(.ql-editor) {
    min-height: 200px;
  }
  
  .header {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 确保容器占满宽度 */
}

  .tip {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  .quill-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 调整工具栏位置 */
.ql-toolbar {
  order: 1; /* 默认已是第一项，此声明可确保优先级 */
}

/* 确保编辑区域在下方 */
.ql-container {
  order: 2;
  min-height: 200px; /* 建议设置最小高度 */
}
  </style>