const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const path = require('path')
const {getUserDoc, getProfiles, hex2Text, zipFile, uploadProfile, getLocation} = require("./service")
const R = require('./R')


const env = app.isPackaged? '': 'dev'
//const env = 'dev'

let win
const createWindow = () => {
    win = new BrowserWindow({
        width: 1200, //800
        height: 700,
        backgroundColor: '#ffffff',
        resizable: false,
        //icon: path.resolve(__dirname, '../src/assets/favicon_m.ico'), // 指定图标路径
        //icon: './assets/favicon_m.ico',
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    if (env === 'dev') {
        win.loadURL('http://localhost:5173/')
        //win.webContents.openDevTools()

    } else {
        win.loadFile('dist/index.html')
        //win.webContents.openDevTools()
    }

}



app.whenReady().then(async () => {
    createWindow()

    //uploadProfile('584DE59BBDE5BA86E6B4BBE58AA8E6A1A3')

    //console.log(getLocation('584DE59BBDE5BA86E6B4BBE58AA8E6A1A3'))
})

app.on('window-all-closed', () => {
    app.quit()
})

ipcMain.handle('event_get_profiles', ()=>{
    return new Promise((resolve,reject)=>{
        const profiles = getProfiles()
        resolve(R.success(profiles))
    })
})

ipcMain.handle('event_upload_profile', (__, profileName)=>{
    return new Promise(async (resolve,reject)=>{
        const resp = await uploadProfile(profileName)
        if(resp){
            resolve(R.success('存档上传成功'))
        }else {
            resolve(R.error('存档上传失败'))
        }
    })
})


