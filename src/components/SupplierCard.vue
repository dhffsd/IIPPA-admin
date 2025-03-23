<!-- SupplierCard.vue 增强版 -->
<template>
    <div class="supplier-card">
      <el-card shadow="hover" class="card-container">
        <template #header>
          <div class="card-header">
            <div class="title-section">
              <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="supplier-name">{{ supplier.name }}</span>
            </div>
            <div class="actions">
              <el-button type="primary" link @click="$emit('edit', supplier)">编辑</el-button>
              <el-button type="danger" link @click="$emit('delete', supplier.id)">删除</el-button>
            </div>
          </div>
        </template>
  
        <div class="supplier-info">
          <div class="info-item">
            <el-icon><user /></el-icon>
            <span class="value">{{ supplier.id }}</span>
          </div>
          <div class="info-item">
            <el-icon><phone /></el-icon>
            <el-link type="primary" :href="`tel:${supplier.contact}`">
              {{ supplier.contact || '暂无' }}
            </el-link>
          </div>
          <div class="info-item">
            <el-icon><star /></el-icon>
            <el-rate 
              v-model="supplier.rating" 
              disabled 
              :max="10" 
              show-score 
              allow-half 
              text-color="#ff9900"
            />
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { User, Phone, Star } from '@element-plus/icons-vue'
  
  defineProps({
    supplier: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['edit', 'delete'])
  </script>
  
  <style scoped>
  .supplier-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .supplier-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .card-container {
    border-radius: 12px;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8f9fa;
    border-radius: 12px 12px 0 0;
  }
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .supplier-name {
    font-size: 1.1em;
    font-weight: 600;
    color: #2c3e50;
  }
  
  .actions {
    display: flex;
    gap: 8px;
  }
  
  .supplier-info {
    padding: 16px;
    background: #ffffff;
  }
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 12px 0;
    font-size: 14px;
  }
  
  .info-item .el-icon {
    color: #409eff;
    font-size: 16px;
  }
  
  .value {
    color: #606266;
  }
  </style>