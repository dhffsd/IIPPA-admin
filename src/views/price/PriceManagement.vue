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
          v-for="(product, index) in filteredProducts"
          :key="product.id"
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
              <h3 class="product-name">{{ product.name }}</h3>
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
                  <el-statistic :value="product.basePrice" :precision="2" />
                </div>
              </div>
              <!-- 物流费用 -->
              <div class="price-item">
                <span class="price-label">物流费用</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="product.logisticsCost" :precision="2" />
                </div>
              </div>
              <!-- 综合成本分割线 -->
              <el-divider class="total-divider">综合成本</el-divider>
              <!-- 综合成本 -->
              <div class="total-price">
                <span class="currency">¥</span>
                <el-statistic
                  :value="product.totalCost"
                  :precision="2"
                  class="highlight-price"
                />
              </div>
              <!-- 最高价 -->
              <div class="price-item">
                <span class="price-label">最高价</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="product.maxPrice || 0" :precision="2" />
                </div>
              </div>
              <!-- 最低价 -->
              <div class="price-item">
                <span class="price-label">最低价</span>
                <div class="price-value">
                  <span class="currency">¥</span>
                  <el-statistic :value="product.minPrice || 0" :precision="2" />
                </div>
              </div>
            </div>
            <!-- 评分部分 -->
            <div class="rating-section">
              <el-rate
                v-model="product.rating"
                disabled
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                :max="5"
                :allow-half="true"
              />
              <span class="rating-text">{{ product.rating.toFixed(1) }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// 模拟商品数据
const products = ref([
  {
    id: 1,
    name: '商品1',
    basePrice: 2450.5,
    logisticsCost: 320.0,
    totalCost: 2770.5,
    rating: 4.7,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 2,
    name: '商品2',
    basePrice: 2380.0,
    logisticsCost: 450.0,
    totalCost: 2830.0,
    rating: 4.5,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 3,
    name: '商品3',
    basePrice: 2550.0,
    logisticsCost: 280.0,
    totalCost: 2830.0,
    rating: 4.9,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 4,
    name: '商品4',
    basePrice: 2420.0,
    logisticsCost: 360.0,
    totalCost: 2780.0,
    rating: 4.6,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 5,
    name: '商品5',
    basePrice: 2500.0,
    logisticsCost: 300.0,
    totalCost: 2800.0,
    rating: 4.8,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 6,
    name: '商品6',
    basePrice: 2350.0,
    logisticsCost: 400.0,
    totalCost: 2750.0,
    rating: 4.4,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 7,
    name: '商品7',
    basePrice: 2600.0,
    logisticsCost: 350.0,
    totalCost: 2950.0,
    rating: 4.3,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 8,
    name: '商品8',
    basePrice: 2200.0,
    logisticsCost: 420.0,
    totalCost: 2620.0,
    rating: 4.6,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 9,
    name: '商品9',
    basePrice: 2580.0,
    logisticsCost: 310.0,
    totalCost: 2890.0,
    rating: 4.7,
    maxPrice: null,
    minPrice: null
  },
  {
    id: 10,
    name: '商品10',
    basePrice: 2320.0,
    logisticsCost: 430.0,
    totalCost: 2750.0,
    rating: 4.5,
    maxPrice: null,
    minPrice: null
  }
]);

const searchQuery = ref('');

const filteredProducts = computed(() => {
  if (searchQuery.value === '') {
    return products.value;
  }
  return products.value.filter(product =>
    product.name.includes(searchQuery.value)
  );
});

onMounted(async () => {
  for (const product of products.value) {
    try {
      const [maxPriceResponse, minPriceResponse] = await Promise.all([
        axios.get(`/api/price-history/max-price/${product.id}`),
        axios.get(`/api/price-history/min-price/${product.id}`)
      ]);

      product.maxPrice = maxPriceResponse.data;
      product.minPrice = minPriceResponse.data;
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  }
});

const filterProducts = () => {
  // 搜索逻辑已在 computed 中实现，这里可以留空
};
</script>

<style lang="scss" scoped>
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