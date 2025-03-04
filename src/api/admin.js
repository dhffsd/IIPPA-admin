//导入request.js请求工具
import request from '@/utils/request.js'

//提供调用管理员注册接口的函数
export const adminRegisterService = (registerData)=>{
    //借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/admin/register',params);
}

//提供调用管理员登录接口的函数
export const adminLoginService = (loginData)=>{
    
    const params = new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
        
    }
    return request.post('/admin/login',params)
}

// 获取管理员信息
export const adminGetInfoService = (params)=>{
    console.log(66);
    return request.get('/admin/getInfo',{params:params})
}



//修改管理员个人信息
export const adminInfoUpdateService = (adminInfoData)=>{
   return request.put('/admin/update',adminInfoData)
}
