const {app, BrowserWindow, ipcMain, Menu, dialog} = require('electron')
const path = require('path')


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

})

app.on('window-all-closed', () => {
    app.quit()
})