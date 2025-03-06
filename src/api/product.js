import request from '@/utils/request.js'
// 增加商品
export const addProductService = (productData)=>{
    return request.post("/admin/product/add",productData)
}

// 修改商品
export const updateProductService = (productData)=>{
    return request.put("/admin/product/update",productData)
}

// 删除商品
export const deleteProductService = (id)=>{
    return request.delete("/admin/product/delete",id)
}

// 获取商品
export const getProductService = (params)=>{
    return request.get("/admin/product/get",{params:params})
}

// 获取商品
export const getAllProductService = (params)=>{
    return request.get("/admin/product/getAll",{params:params})
}