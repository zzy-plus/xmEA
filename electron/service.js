const { execSync } = require('child_process')
const fs = require('fs')
const path =require('path')
const zipFolder = require('zip-folder')
const fsx = require('fs-extra')
const axios = require('axios')





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
    const profilePath = getUserDoc() + '\\Euro Truck Simulator 2\\profiles'
    const files = fs.readdirSync(profilePath)
    const profiles = []
    for (const file of files) {
        const filePath = path.join(profilePath, file)
        const stat = fs.statSync(filePath)
        if(stat.isDirectory()){
            profiles.push(hex2Text(file))
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
            resolve(0)
        });
    })
}



module.exports = {
    getUserDoc,
    getProfiles,
    hex2Text,
    zipFile
}
