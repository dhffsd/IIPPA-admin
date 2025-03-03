import {defineStore} from 'pinia'
import {ref} from 'vue'
const useUserInfoStore = defineStore('userInfo',()=>{
    //定义状态相关的内容

    const info = ref({})
    const adminInfo = ref({
        username: '' 
    })

    const setInfo = (newInfo)=>{
        info.value = newInfo
    }

    const setUsername = (newUserName)=>{
        adminInfo.value.username = newUserName

    }

    const removeInfo = ()=>{
        info.value = {}
    }
    console.log('adminInfo.value.username: ', adminInfo.value.username);
    return {info,adminInfo,setInfo,removeInfo,setUsername}

},{persist:true})

export default useUserInfoStore;