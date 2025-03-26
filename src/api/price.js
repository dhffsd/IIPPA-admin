import request from '@/utils/request.js'

// 获取所有价格数据
export const getAllPriceService = ()=>{
    return request.get("/admin/price/get")
}