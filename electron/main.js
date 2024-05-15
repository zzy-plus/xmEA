const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const path = require('path')
const {getUserDoc, getProfiles, hex2Text, zipFile, uploadProfile} = require("./service") ;


const env = app.isPackaged? '': 'dev'

let win
const createWindow = () => {
    win = new BrowserWindow({
        width: 1200, //800
        height: 613,
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
        win.webContents.openDevTools()
    } else {
        win.loadFile('dist/index.html')
        //win.webContents.openDevTools()
    }

}



app.whenReady().then(async () => {
    createWindow()
    //zipFile('E:\\Desktop\\tmpsearch', 'E:\\Desktop\\tmpsearch.zip')
    uploadProfile('584DE695A3E4BABAE8BDA6E9989F31392D3230E697A5E6B4BBE58AA8E6A1A32DE7A681E5A496E4BCA0')
})

app.on('window-all-closed', () => {
    app.quit()
})