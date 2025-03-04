<script setup>
import { ref } from 'vue'
import {
  Goods,
  User,
  Box,
  CaretTop,
  CaretBottom,
  DataAnalysis
} from '@element-plus/icons-vue'
import CountUp from 'vue-countup-v3'

// 模拟数据
const totalProducts = ref(100)
const totalUsers = ref(200)
const totalSuppliers = ref(300)

// 趋势数据
const productTrend = ref(5.5)
const userTrend = ref(-2.3)
const supplierTrend = ref(3.8)
</script>

<template>
  <el-card class="dashboard-container">
    <template #header>
      <div class="enhanced-header">
        <el-icon :size="24" color="#409EFF"><DataAnalysis /></el-icon>
        <span class="header-text">运营数据看板</span>
        <el-tag type="info" effect="dark">实时更新</el-tag>
      </div>
    </template>

    <el-row :gutter="24" class="card-container">
      <!-- 商品卡片 -->
      <el-col :xs="24" :sm="12" :md="8" class="card-col">
        <div class="floating-card goods-card">
          <div class="decorative-wave"></div>
          <el-icon class="card-icon"><Goods /></el-icon>
          <div class="card-content">
            <div class="card-title">商品总数</div>
            <count-up 
              class="card-value"
              :end-val="totalProducts"
              :options="{ duration: 1.5 }"
            />
            <div class="card-trend">
              <el-icon :color="productTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="productTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(productTrend) }}%
            </div>
          </div>
        </div>
      </el-col>

      <!-- 用户卡片 -->
      <el-col :xs="24" :sm="12" :md="8" class="card-col">
        <div class="floating-card user-card">
          <div class="decorative-wave"></div>
          <el-icon class="card-icon"><User /></el-icon>
          <div class="card-content">
            <div class="card-title">用户总数</div>
            <count-up 
              class="card-value"
              :end-val="totalUsers"
              :options="{ duration: 1.5 }"
            />
            <div class="card-trend">
              <el-icon :color="userTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="userTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(userTrend) }}%
            </div>
          </div>
        </div>
      </el-col>

      <!-- 供应商卡片 -->
      <el-col :xs="24" :sm="12" :md="8" class="card-col">
        <div class="floating-card supplier-card">
          <div class="decorative-wave"></div>
          <el-icon class="card-icon"><Box /></el-icon>
          <div class="card-content">
            <div class="card-title">供应商总数</div>
            <count-up 
              class="card-value"
              :end-val="totalSuppliers"
              :options="{ duration: 1.5 }"
            />
            <div class="card-trend">
              <el-icon :color="supplierTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="supplierTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(supplierTrend) }}%
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped lang="scss">
.dashboard-container {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  margin: 20px;

  .enhanced-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;

    .header-text {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.card-container {
  padding: 20px 0;
}

.floating-card {
  position: relative;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  min-height: 180px;
  margin: 10px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    
    .decorative-wave {
      transform: translateX(-10%);
    }
  }

  .decorative-wave {
    position: absolute;
    top: -60px;
    right: -30px;
    width: 150px;
    height: 150px;
    border-radius: 40% 60% 60% 40%;
    transition: transform 0.6s ease;
  }

  .card-icon {
    font-size: 40px;
    margin-bottom: 20px;
  }

  .card-content {
    position: relative;
    z-index: 1;
    
    .card-title {
      font-size: 16px;
      color: #909399;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 32px;
      font-weight: 700;
      color: #303133;
      margin-bottom: 12px;
    }

    .card-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }
  }

  &.goods-card {
    .card-icon { color: #409EFF; }
    .decorative-wave {
      background: linear-gradient(45deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.2) 100%);
    }
  }

  &.user-card {
    .card-icon { color: #67C23A; }
    .decorative-wave {
      background: linear-gradient(45deg, rgba(103, 194, 58, 0.1) 0%, rgba(103, 194, 58, 0.2) 100%);
    }
  }

  &.supplier-card {
    .card-icon { color: #E6A23C; }
    .decorative-wave {
      background: linear-gradient(45deg, rgba(230, 162, 60, 0.1) 0%, rgba(230, 162, 60, 0.2) 100%);
    }
  }
}

@media (max-width: 768px) {
  .card-col {
    margin-bottom: 20px;
  }
}
</style>