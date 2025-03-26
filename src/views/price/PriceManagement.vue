<template>
  <div class="compare-container">
    <!-- 标题 -->
    <h1 class="page-title">商品价格对比</h1>
    <!-- 搜索栏 -->
    <el-input
      v-model="searchQuery"
      placeholder="请输入商品名称进行搜索"
      clearable
      @keyup.enter="filterProducts"
      style="width: 300px; margin-bottom: 20px"
    >
      <!-- <template #suffix>
        <el-button icon="Search" @click="filterProducts"></el-button>
      </template> -->
    </el-input>
    <!-- 商品列表 -->
    <div class="product-list">
      <el-row :gutter="20" class="center-container">
        <el-col
          v-for="(item, index) in filteredProducts"
          :key="item.history.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <el-card class="product-card" shadow="hover">
            <!-- 卡片头部 -->
            <div class="card-header">
              <el-tag type="info" class="rank-tag">No.{{ index + 1 }}</el-tag>
              <h3 class="product-name">{{ item.productName }}</h3>
            </div>
            <!-- 分割线 -->
            <el-divider />
            <!-- 价格部分 -->
            <div class="price-section">
              <!-- 商品价格 -->
              <div class="price-item">
                <span class="price-label">商品价格</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="item.history.price" :precision="2" />
                </div>
              </div>
              <!-- 物流费用 -->
              <div class="price-item">
                <span class="price-label">物流费用</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="item.history.logisticsCost" :precision="2" />
                </div>
              </div>
              <!-- 综合成本分割线 -->
              <el-divider class="total-divider">综合成本</el-divider>
              <!-- 综合成本 -->
              <div class="total-price">
                <span class="currency">¥</span>
                <el-statistic
                  :value="item.history.totalCost"
                  :precision="2"
                  class="highlight-price"
                />
              </div>
              <!-- 最高价 -->
              <div class="price-item">
                <span class="price-label">最高价</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="item.history.maxPrice || 0" :precision="2" />
                </div>
              </div>
              <!-- 最低价 -->
              <div class="price-item">
                <span class="price-label">最低价</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="item.history.minPrice || 0" :precision="2" />
                </div>
              </div>
            </div>
            <!-- 评分部分 -->
            <div class="rating-section">
              <el-rate
                v-model="item.history.rating"
                disabled
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :max="5"
                :allow-half="true"
              />
              <span class="rating-text">{{ item.history.rating.toFixed(1) }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAllPriceService } from '@/api/price.js';

const searchQuery = ref('');
const dataList = ref([]);

const filteredProducts = computed(() => {
  if (searchQuery.value === '') {
    return dataList.value;
  }
  return dataList.value.filter(item =>
    item.productName.includes(searchQuery.value)
  );
});

onMounted(async () => {
  try {
    const response = await getAllPriceService();
    if (response.code === 200) {
      dataList.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const filterProducts = () => {
  // 搜索逻辑已在 computed 中实现，这里可以留空
};
</script>

<style lang="scss" scoped>
// 样式部分保持不变
.compare-container {
  padding: 20px;
  max-width: 1400px; 
  margin: 0 auto;
  text-align: center; 
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 让整个列表在容器内水平居中 */
}

.center-container {
  width: 100%; /* 确保 row 占满容器宽度 */
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  width: auto; /* 取消固定的100%宽度，让卡片根据内容自适应 */
  min-width: 280px; /* 设置最小宽度，防止卡片过小 */
  flex: 1 0 auto; /* 使卡片在弹性布局中合理分配空间 */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  }

 .card-header {
    display: flex;
    align-items: center;
    justify-content: center; 
    gap: 12px;
    background-color: #f9f9f9; 
    padding: 12px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

   .rank-tag {
      font-size: 16px;
      padding: 8px 12px;
    }

   .product-name {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
  }

 .price-section {
    padding: 12px;

   .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;

     .price-label {
        color: #606266;
        font-size: 14px;
      }

     .price-value {
        display: flex;
        align-items: center;
        gap: 4px;

       .currency {
          color: #F56C6C;
          font-weight: bold;
        }

        :deep(.el-statistic__content) {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }

   .total-divider {
      margin: 16px 0;

      :deep(.el-divider__text) {
        background: #fff;
        font-size: 14px;
        color: #909399;
      }
    }

   .total-price {
      text-align: center;
      margin-top: 16px;

     .currency {
        font-size: 24px;
        color: #F56C6C;
        vertical-align: middle;
      }

     .highlight-price {
        :deep(.el-statistic__content) {
          font-size: 28px;
          color: #F56C6C;
        }
      }
    }
  }

 .rating-section {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding-bottom: 12px;

   .rating-text {
      color: #F7BA2A;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

@media (max-width: 768px) {
 .compare-container {
    padding: 10px;
  }

 .product-card {
   .product-name {
      font-size: 16px;
    }

   .price-section {
     .total-price {
        :deep(.el-statistic__content) {
          font-size: 22px;
        }
      }
    }
  }
}
</style>