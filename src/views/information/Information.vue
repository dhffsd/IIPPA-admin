<template>
  <el-card class="dashboard-container">
    <template #header>
      <div class="enhanced-header">
        <el-icon :size="24" color="#409EFF"><DataAnalysis /></el-icon>
        <span class="header-text">智能运营分析平台</span>
        <el-tag type="info" effect="dark">实时数据 每5分钟更新</el-tag>
      </div>
    </template>

    <!-- 核心指标卡片 -->
    <el-row :gutter="24" class="card-container">
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
            <!-- <div class="card-trend">
              <el-icon :color="productTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="productTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(productTrend).toFixed(2) }}%
            </div> -->
          </div>
        </div>
      </el-col>

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
            <!-- <div class="card-trend">
              <el-icon :color="userTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="userTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(userTrend).toFixed(2) }}%
            </div> -->
          </div>
        </div>
      </el-col>

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
            <!-- <div class="card-trend">
              <el-icon :color="supplierTrend >= 0 ? '#67C23A' : '#F56C6C'">
                <CaretTop v-if="supplierTrend >= 0" />
                <CaretBottom v-else />
              </el-icon>
              {{ Math.abs(supplierTrend).toFixed(2) }}%
            </div> -->
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 数据分析图表 -->
    <el-row :gutter="24" class="chart-container">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-title">年度销售趋势（万元）</div>
          </template>
          <vue-echarts
            :option="{
              tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br/>{a0}: ¥{c0}万'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: salesTrend.xAxis,
                axisLabel: {
                  rotate: 45
                }
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '¥{value}万'
                }
              },
              series: salesTrend.series
            }"
            style="height: 320px"
          />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-title">收入来源分布</div>
          </template>
          <vue-echarts
            :option="{
              tooltip: {
                trigger: 'item',
                formatter: '{b}: {d}% (¥{c}万)'
              },
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              series: revenueSources.series
            }"
            style="height: 320px"
          />
        </el-card>
      </el-col>

      <el-col :xs="24">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-title">地区销售分布（万元）</div>
          </template>
          <vue-echarts
            :option="{
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              xAxis: {
                data: regionalSales.xAxis,
                axisLabel: {
                  interval: 0,
                  rotate: 45
                }
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '¥{value}万'
                }
              },
              series: regionalSales.series
            }"
            style="height: 280px"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时交易表格 -->
    <el-card class="data-table">
      <template #header>
        <div class="chart-title">实时交易记录</div>
      </template>
      <el-table 
        :data="recentOrders" 
        stripe 
        style="width: 100%"
        :row-class-name="({ rowIndex }) => rowIndex % 2 === 0 ? 'even-row' : 'odd-row'"
      >
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="amount" label="金额" align="right">
          <template #default="{ row }">¥ {{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag 
              :type="{
                '已完成': 'success',
                '已发货': 'primary',
                '待付款': 'danger'
              }[row.status]"
              effect="dark"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="200" />
      </el-table>
    </el-card>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueEcharts } from 'vue3-echarts'
import {
  Goods,
  User,
  Box,
  CaretTop,
  CaretBottom,
  DataAnalysis
} from '@element-plus/icons-vue'
import CountUp from 'vue-countup-v3'
// 导入 echarts 库
import * as echarts from 'echarts'; 
import {  
  getProductService,
  getSupplierService,
  getUserService
} from '@/api/info.js'

// 核心指标数据
const totalProducts = ref(0)
const totalUsers = ref(0)
const totalSuppliers = ref(0)

// 上一次的核心指标数据
const prevTotalProducts = ref(0)
const prevTotalUsers = ref(0)
const prevTotalSuppliers = ref(0)

// 趋势数据
const productTrend = ref(0)
const userTrend = ref(0)
const supplierTrend = ref(0)

// 销售趋势图表数据
const salesTrend = ref({
  xAxis: [],
  series: [{
    name: '销售额',
    type: 'line',
    smooth: true,
    data: [],
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(64, 158, 255, 0.4)'
        }, {
          offset: 1,
          color: 'rgba(64, 158, 255, 0)'
        }]
      }
    },
    lineStyle: {
      width: 3,
      color: '#409EFF'
    }
  }]
})

// 收入来源饼图数据
const revenueSources = ref({
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [],
    label: {
      formatter: '{b}: {d}%'
    }
  }]
})

// 地区销售柱状图数据
const regionalSales = ref({
  xAxis: [],
  series: [{
    type: 'bar',
    data: [],
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#83bff6' },
        { offset: 0.5, color: '#188df0' },
        { offset: 1, color: '#188df0' }
      ])
    }
  }]
})

// 实时订单数据
const recentOrders = ref([])

const fetchData = async () => {
  try {
    // 保存上一次的数据
    prevTotalProducts.value = totalProducts.value
    prevTotalUsers.value = totalUsers.value
    prevTotalSuppliers.value = totalSuppliers.value

    // 获取商品总数
    const productRes = await getProductService();
    totalProducts.value = productRes.data;
    if (prevTotalProducts.value!== 0) {
      productTrend.value = ((totalProducts.value - prevTotalProducts.value) / prevTotalProducts.value) * 100
    }

    // 获取用户总数
    const userRes = await getUserService();
    totalUsers.value = userRes.data;
    if (prevTotalUsers.value!== 0) {
      userTrend.value = ((totalUsers.value - prevTotalUsers.value) / prevTotalUsers.value) * 100
    }

    // 获取供应商总数
    const supplierRes = await getSupplierService();
    totalSuppliers.value = supplierRes.data;
    if (prevTotalSuppliers.value!== 0) {
      supplierTrend.value = ((totalSuppliers.value - prevTotalSuppliers.value) / prevTotalSuppliers.value) * 100
    }

    // 这里需要根据实际接口补充获取销售趋势、收入来源、地区销售、实时订单的数据
    // 例如：
    // const salesTrendRes = await getSalesTrendService();
    // salesTrend.value.xAxis = salesTrendRes.data.xAxis;
    // salesTrend.value.series[0].data = salesTrendRes.data.seriesData;

    // const revenueSourcesRes = await getRevenueSourcesService();
    // revenueSources.value.series[0].data = revenueSourcesRes.data;

    // const regionalSalesRes = await getRegionalSalesService();
    // regionalSales.value.xAxis = regionalSalesRes.data.xAxis;
    // regionalSales.value.series[0].data = regionalSalesRes.data.seriesData;

    // const recentOrdersRes = await getRecentOrdersService();
    // recentOrders.value = recentOrdersRes.data;
  } catch (error) {
    console.error('数据获取失败:', error);
  }
};

onMounted(() => {
  fetchData();
  // 每5分钟更新一次数据
  setInterval(fetchData, 5 * 60 * 1000);
});
</script>

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

  .chart-container {
    margin-top: 24px;
    
    .chart-card {
      margin-bottom: 24px;
      border-radius: 8px;
      transition: box-shadow 0.3s;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .chart-title {
        font-weight: 600;
        color: #303133;
        font-size: 16px;
      }
    }
  }

  .data-table {
    margin-top: 24px;
    
    ::v-deep(.el-table) {
      th.el-table__cell {
        background-color: #f8f9fa;
        font-weight: 600;
      }
      
      .even-row {
        background-color: #fafafa;
      }
      
      .odd-row {
        background-color: #fff;
      }
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