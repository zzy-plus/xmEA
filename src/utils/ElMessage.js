
export class Msg {

    static success = (msg)=>{
        ElMessage({
            type: 'success',
            message: msg
        })
    }

    static info = (msg)=>{
        ElMessage({
            type: 'info',
            message: msg
        })
    }

    static warning = (msg)=>{
        ElMessage({
            type: 'warning',
            message: msg
        })
    }


    static error = (msg)=>{
        ElMessage({
            type: 'error',
            message: msg
        })
    }


}