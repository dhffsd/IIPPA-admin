import {defineStore} from 'pinia'
import {ref} from 'vue'
const useUserInfoStore = defineStore('userInfo',()=>{
    //定义状态相关的内容

    const info = ref({})
    const adminInfo = ref({
        username: '',
        role: '' 
    })

    const setInfo = (newInfo)=>{
        info.value = newInfo
    }

    const setUsername = (newUserName)=>{
        
        adminInfo.value.username = newUserName
        

    }

    const setRole = (newRole)=>{
        
        adminInfo.value.role = newRole
        

    }


    const removeInfo = ()=>{
        info.value = {}
    }
    
    return {info,adminInfo,setInfo,removeInfo,setUsername,setRole}

},{persist:true})

export default useUserInfoStore;