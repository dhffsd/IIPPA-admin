import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import ArticleCategoryVue from '@/views/article/ArticleCategory.vue'
import ArticleManageVue from '@/views/article/ArticleManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import InformationVue from '../views/information/Information.vue'
import PriceManagementVue from '../views/price/PriceManagement.vue'
import ProductManagementVue from '../views/product/ProductManagement.vue'
import SupplierManagementVue from '../views/supplier/SupplierManagement.vue'
import UserVue from '../views/user/UserVue.vue'

//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue,redirect:'/info/manage', children: [
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue },
            { path: '/info/manage', component: InformationVue },
            { path: '/price/manage', component: PriceManagementVue },
            { path: '/product/manage', component: ProductManagementVue },
            { path: '/supplier/manage', component: SupplierManagementVue },
            { path: '/user/manage', component: UserVue}
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

//导出路由
export default router
