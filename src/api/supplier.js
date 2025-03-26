import request from '@/utils/request.js'

// 增加供应商服务
export const addSupplierService =(supplierData)=>{
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in supplierData){
        params.append(key,supplierData[key]);
    }
    return request.post("/admin/supplier/add",params);
}

// 获取供应商服务
export const getSupplierService = () =>{
    return request.get("/admin/supplier/getAll")
}


// 根据供应商名称查询
export const getSupplierNameService = (params) => {
    return request.get("/admin/supplier/getName",{params:params})
}


// 修改供应商服务
export const updateSupplierService = (supplierData) => {
    const params = new URLSearchParams();
    for(let key in supplierData){
        params.append(key,supplierData[key])
    }

    return request.put("/admin/supplier/update",params)
} 

// 删除供应商服务
export const deleteSupplierService = (id) => {
    return request.delete("/admin/supplier/delete",{params:{id:Number(id)}})
}