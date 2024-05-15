const { execSync } = require('child_process')
const fs = require('fs')
const path =require('path')
const zipFolder = require('zip-folder')
const fsx = require('fs-extra')
const axios = require('axios')
const request = require('request');



//const baseUrl = 'http://localhost:8080'
const baseUrl = 'http://10.7.62.164:8080'



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

const zipFile = (filePath, zipPath)=>{

    return new Promise((resolve,reject)=>{
        const tempDir = getUserDoc() + '\\linkSavaTemp'
        if(!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir, { recursive: true })
        }

        //复制目录
        fsx.copySync(filePath, path.join(tempDir, path.basename(filePath)));

        //压缩文件
        zipFolder(tempDir, zipPath, function(err) {
            if (err) {
                console.log('打包文件夹失败:', err);
            } else {
                console.log('文件夹成功打包到:', zipPath);
            }
            fsx.emptyDirSync(tempDir)
            resolve(true)
        });
    })
}


const uploadProfile = async (profileName)=>{
    const profilesPath = getUserDoc() + '\\Euro Truck Simulator 2\\profiles'
    const profilePath = profilesPath + `\\${profileName}`
    const zipPath = profilesPath + `\\${profileName}.zip`
    //压缩
    const result = await zipFile(profilePath, zipPath)
    console.log(typeof (result))
    if(!result) return

    //上传 todo file==null
    const file = fs.createReadStream(zipPath, {encoding: 'binary'})
    const formData = new FormData()
    formData.append('file', file)

    const resp = await axios.post(baseUrl + '/common/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })

    console.log(resp.data)



}


module.exports = {
    getUserDoc,
    getProfiles,
    hex2Text,
    zipFile,
    uploadProfile
}
