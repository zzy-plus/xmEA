const { execSync } = require('child_process')
const fs = require('fs')
const path =require('path')
const zipFolder = require('zip-folder')
const fsx = require('fs-extra')
const axios = require('axios')
const request = require('request')
const FormData = require('form-data');



const baseUrl = 'http://errorserver.top:5005'
//const baseUrl = 'http://10.7.62.164:8080'

 

const getUserDoc = ()=>{
    const output = execSync('reg query \"HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders\" /v Personal | findstr Personal')
    const line = output.toString().trim()
    const userDoc = line.split('    ')[2]
    return userDoc
}

const hex2Text = (hex)=>{
    const buff = Buffer.from(hex, 'hex')
    return buff.toString('utf8')
}

const getProfiles = ()=>{
    const profilesPath = getUserDoc() + '\\Euro Truck Simulator 2\\profiles'
    const files = fs.readdirSync(profilesPath)
    const profiles = []
    for (const file of files) {
        const filePath = path.join(profilesPath, file)
        const stat = fs.statSync(filePath)
        if(stat.isDirectory()){
            profiles.push({
                name: file,
                cname: hex2Text(file)
            })
        }
    }
    return profiles
}


const processSave = (tempFilePath)=>{
    //修改profile.sii
    const tempProfileSiiPath = tempFilePath + '\\profile.sii'
    const tempProfileBakSiiPath = tempFilePath + '\\profile.bak.sii'
    try {
        execSync(`resources\\SII_Decrypt \"${tempProfileSiiPath}\"`)
    }catch (e) { }
    const content = fs.readFileSync(tempProfileSiiPath, 'utf8')
    const lines = content.split('\r\n')
    const newLines = []
    const pattern = /cached_discovery\[([0-9]+)]/
    for (const line of lines) {
        if(line.trim().startsWith('cached_discovery:')){
            newLines.push(' cached_discovery: 200')
        }else if(line.trim().startsWith('cached_discovery[')){
            const result = pattern.exec(line)
            if(Number(result[1]) < 200){
                newLines.push(line)
            }
        }else {
            newLines.push(line)
        }
    }
    fs.writeFileSync(tempProfileSiiPath, newLines.join('\r\n'), 'utf8')

    //直接删了 哈哈
    if(fs.existsSync(tempProfileBakSiiPath)){
        fs.rmSync(tempProfileBakSiiPath)
    }

    //修改info.sii
    const infoSiiPath = tempFilePath + '\\save\\quicksave\\info.sii'
    try {
        execSync(`resources\\SII_Decrypt \"${infoSiiPath}\"`)
    }catch (e) { }
    const content2 = fs.readFileSync(infoSiiPath, 'utf8')
    const lines2 = content2.split('\r\n')
    const newLines2 = []
    for (const line of lines2) {
        if(line.trim().startsWith('dependencies:')){
            newLines2.push(' dependencies: 4')
            newLines2.push(' dependencies[0]: "dlc|eut2_daf_21|DLC - DAF 2021"')
            newLines2.push(' dependencies[1]: "dlc|eut2_daf_xd|DLC - DAF XD"')
            newLines2.push(' dependencies[2]: "dlc|eut2_man_tgx|DLC - MAN TGX 2020"')
            newLines2.push(' dependencies[3]: "rdlc|eut2_rocket_league|DLC - Rocket League"')
        }else if(line.trim().startsWith('dependencies[')){
            continue
        }else {
            newLines2.push(line)
        }
    }
    fs.writeFileSync(infoSiiPath, newLines2.join('\r\n'), 'utf8')

}

const zipFile = (filePath, zipPath)=>{

    return new Promise((resolve,reject)=>{
        const tempDir = getUserDoc() + '\\linkSavaTemp'
        if(!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir, { recursive: true })
        }

        //复制目录
        const tempFilePath = path.join(tempDir, path.basename(filePath))
        fsx.copySync(filePath, tempFilePath)

        //删除不必要的文件
        const tempSavePath = tempFilePath + '\\save'
        const saves = fs.readdirSync(tempSavePath)
        if(!saves.includes('quicksave')){
            resolve(false)
            console.log('没有quicksave文件夹！')
            return
        }
        for (const save of saves) {
            if(save === 'quicksave') continue
            fs.rmSync(tempSavePath + `\\${save}`, { recursive: true })
        }

        processSave(tempFilePath)

        //压缩文件
        zipFolder(tempDir, zipPath, function(err) {
            if (err) {
                console.log('打包文件夹失败:', err);
                resolve(false)
            } else {
                console.log('文件夹成功打包到:', zipPath);
                //清空临时文件夹
                fsx.emptyDirSync(tempDir)
                resolve(true)
            }
        });
    })
}


const uploadProfile = async (profileName)=>{
    const profilesPath = getUserDoc() + '\\Euro Truck Simulator 2\\profiles'
    const profilePath = profilesPath + `\\${profileName}`
    const zipPath = profilesPath + `\\${profileName}.zip`
    //压缩
    const result = await zipFile(profilePath, zipPath)
    if(result){
        //上传
        const file = fs.createReadStream(zipPath)
        const formData = new FormData()
        formData.append('file', file)

        const resp = await axios.post(baseUrl + '/common/upload',
            formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
        console.log(resp.data)
    }
    //删除压缩包
    if(fs.existsSync(zipPath)){
        fs.rmSync(zipPath)
        console.log(`删除${profileName}.zip`)
    }
    return result
}

const getLocation = (profileName)=>{
    const profilesPath = getUserDoc() + '\\Euro Truck Simulator 2\\profiles'
    const gameSiiPath = `${profilesPath}\\${profileName}\\save\\quicksave\\game.sii`    //默认读取quicksave中的数据
    if(!fs.existsSync(gameSiiPath)) {
        console.log(`${gameSiiPath}不存在！`)
        return undefined
    }

    console.log(gameSiiPath)

    try {
        execSync(`resources\\SII_Decrypt \"${gameSiiPath}\"`)
    }catch (e) { }

    const lines = fs.readFileSync(gameSiiPath, 'utf8').split('\r\n')

    const data = {}
    for (const line of lines) {
        if(line.trim().startsWith('truck_placement')){
            data['truck'] = line.trim()
        }else if(line.trim().startsWith('trailer_placement')){
            data['trailer'] = line.trim()
            break
        }
    }
    return data
}


module.exports = {
    getUserDoc,
    getProfiles,
    hex2Text,
    zipFile,
    uploadProfile,
    getLocation
}
