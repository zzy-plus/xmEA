
class R{

    code
    data
    msg

    static success(data){
        const r = new R()
        r.code = 0
        r.data = data
        return r
    }


    static error(msg){
        const r = new R()
        r.code = 1
        r.msg = msg
        return r
    }
}


module.exports = R