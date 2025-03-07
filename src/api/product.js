import request from '@/utils/request.js'
// 增加商品
export const addProductService = (productData)=>{
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in productData){
        params.append(key,productData[key]);
    }
    return request.post("/admin/product/add",params)
}

// 修改商品
export const updateProductService = (productData)=>{
    
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in productData){
        params.append(key,productData[key]);
    }
    return request.put("/admin/product/update",params)
}

// 删除商品
export const deleteProductService = (id)=>{
    
    return request.delete("/admin/product/delete",{params:{id:Number(id)}})
}

// 根据id获取商品
export const getProductService = (params)=>{
    return request.get("/admin/product/getId",{params:params})
}

// 获取商品
export const getAllProductService = (params)=>{
    return request.get("/admin/product/getAll",{params:params})
}