<template>
  <el-card class="page-container">
      <template #header>
          <div class="header">
              <span>用户管理</span>
              <el-button type="primary" @click="showAddDialog" auto-insert-space>新增用户</el-button>
          </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :model="searchForm" ref="searchFormRef" inline>
          <el-form-item label="用户名" prop="username">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
              <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="users" v-loading="loading" border stripe>
          <el-table-column prop="userPic" label="头像" width="120">
              <template #default="{row}">
                  <img :src="row.userPic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
                       class="table-image" />
              </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" min-width="160" />
          <el-table-column prop="email" label="邮箱" min-width="240" />
          <el-table-column prop="createTime" label="创建时间" width="180">
              <template #default="{row}">
                  {{ formatTime(row.createTime) }}
              </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180">
              <template #default="{row}">
                  {{ formatTime(row.updateTime) }}
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
          :title="isEditMode ? '编辑用户' : '新增用户'" 
          size="40%"
      >
          <el-form 
              :model="userModel" 
              ref="userFormRef" 
              label-width="80px" 
              :rules="rules"
          >
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="userModel.username" placeholder="请输入用户名" />
              </el-form-item>

              <el-form-item label="密码" prop="password" v-if="!isEditMode">
                  <el-input 
                      v-model="userModel.password" 
                      placeholder="请输入密码" 
                      show-password 
                  />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userModel.email" placeholder="请输入邮箱" />
              </el-form-item>

              <el-form-item label="用户头像">
                  <el-input v-model="userModel.userPic" placeholder="头像URL" />
                  <div class="tip">支持JPG/PNG格式图片链接</div>
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
import dayjs from 'dayjs';
import { userInfoService } from '@/api/user.js'; // 引入 API 函数

// 数据状态
const users = ref([]);
const total = ref(0);
const loading = ref(false);
const visibleDrawer = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const isEditMode = ref(false);

// 时间格式化
const formatTime = (time) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '--';
};

// 表单相关
const searchForm = reactive({
  username: '',
  email: ''
});

const userModel = reactive({
  id: '',
  username: '',
  password: '',
  email: '',
  userPic: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

const searchFormRef = ref();
const userFormRef = ref();

// 生命周期
onMounted(() => {
  loadUsers();
});

// 数据加载
const loadUsers = async () => {
  loading.value = true;
  try {
      const params = {
          page: pageNum.value,
          size: pageSize.value,
          username: searchForm.username,
          email: searchForm.email
      };

      const response = await userInfoService(params);
      users.value = response.data.items; // 假设 API 返回的数据结构有 items 字段存储用户列表
      total.value = response.data.total; // 假设 API 返回的数据结构有 total 字段存储总数量
  } catch (error) {
      ElMessage.error('数据加载失败');
  } finally {
      loading.value = false;
  }
};

// 搜索和分页
const handleSearch = () => {
  pageNum.value = 1;
  loadUsers();
};

const resetSearch = () => {
  searchFormRef.value.resetFields();
  handleSearch();
};

const onSizeChange = (size) => {
  pageSize.value = size;
  loadUsers();
};

const onCurrentChange = (page) => {
  pageNum.value = page;
  loadUsers();
};

// 用户操作
const showAddDialog = () => {
  isEditMode.value = false;
  resetForm();
  visibleDrawer.value = true;
};

const handleEdit = (id) => {
  const targetUser = users.value.find(user => user.id === id);
  if (targetUser) {
      Object.assign(userModel, targetUser);
      isEditMode.value = true;
      visibleDrawer.value = true;
  } else {
      ElMessage.error('数据获取失败');
  }
};

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
  }).then(async () => {
      // 这里假设还有一个删除用户的 API 函数，需要根据实际情况引入和调用
      // 例如：import { deleteUserService } from '@/api/user.js';
      // await deleteUserService(id);
      users.value = users.value.filter(user => user.id !== id);
      total.value = users.value.length;
      ElMessage.success('删除成功');
  }).catch(() => {});
};

const submitForm = async () => {
  try {
      await userFormRef.value.validate();
      if (isEditMode.value) {
          // 这里假设还有一个更新用户的 API 函数，需要根据实际情况引入和调用
          // 例如：import { updateUserService } from '@/api/user.js';
          // await updateUserService(userModel);
          const index = users.value.findIndex(user => user.id === userModel.id);
          if (index > -1) {
              users.value[index] = { ...userModel };
              ElMessage.success('更新成功');
          } else {
              ElMessage.error('更新失败');
          }
      } else {
          // 这里假设还有一个添加用户的 API 函数，需要根据实际情况引入和调用
          // 例如：import { addUserService } from '@/api/user.js';
          // await addUserService(userModel);
          const newId = users.value.length + 1;
          userModel.id = newId;
          users.value.push({ ...userModel });
          total.value = users.value.length;
          ElMessage.success('添加成功');
      }
      visibleDrawer.value = false;
  } catch (error) {
      ElMessage.error('表单验证不通过，请检查输入内容');
  }
};

// 工具方法
const resetForm = () => {
  userFormRef.value?.resetFields();
  Object.assign(userModel, {
      id: '',
      username: '',
      password: '',
      email: '',
      userPic: ''
  });
};
</script>

<style scoped>
.table-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tip {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
</style>