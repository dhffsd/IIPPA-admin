import request from '@/utils/request.js'

// 获取商品数量
export const getProductService = () => {
    return request.get("/admin/info/getProductTotal")
}

// 获取供应商数量
export const getSupplierService = () => {
    return request.get("/admin/info/getSupplierTotal")
}


// 获取用户数量
export const getUserService = () => {
    return request.get("/admin/info/getUserTotal")
}
