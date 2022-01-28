'use strict'

import {app, protocol, BrowserWindow, ipcMain, shell, dialog, clipboard } from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import * as path from "path"

import parser from '@/util/background/qq/parser'

const { autoUpdater } = require('electron-updater')
autoUpdater.autoDownload = false

const isDevelopment = process.env.NODE_ENV !== 'production'

const fs = require('fs')

const templatesPath =
    process.env.NODE_ENV === 'development'
        ? path.join(__dirname, '../templates')
        : path.join(process.resourcesPath, 'templates');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])
let win = null
async function createWindow() {
    // Create the browser window.
      win = new BrowserWindow({
        width: 800,
        height: 620,
        minWidth:800,
        minHeight:620,
        show: false,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        },
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, './public/favicon.ico'),
    })

    win.once('ready-to-show', () => {
        win.show()
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

// 日志记录器
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'})
    ],
});

process.on('uncaughtException', error => {

    logger.error(error.name)
    logger.error(error.message)
    logger.error(error.stack)

    app.exit();
});

ipcMain.handle('open-url', async (event, url) => {
    shell.openExternal(url)
})

ipcMain.handle('exit-app', async (event) => {
    app.exit()
})

ipcMain.handle('min-app', async () => {
    if (!win.isMinimized()){
        win.minimize()
    }
})

ipcMain.handle('max-app', async () => {
    if (win.isMaximized()){
        win.unmaximize()
    }else{
        win.maximize()
    }
})

// 文件选择器
ipcMain.handle('select-file', async (event) => {
    return dialog.showOpenDialogSync({
        properties: ['openFile'],
        filters: [{
            name: 'txt 文本文件',
            extensions: ['txt']
        }],
    })
})

// 目录选择器
ipcMain.handle('select-dir', async (event) => {
    return dialog.showOpenDialogSync({
        properties: ['openDirectory', 'promptToCreate', 'createDirectory']
    })
})

// 处理文件
ipcMain.handle('qq-report', async (event, path, lineCount, setting, commonSetting) => {
    parser.parse(path, lineCount, setting, win, commonSetting, logger)
    // console.log(path, lineCount, setting)
})

// 获取行数
ipcMain.handle('count-line', async (event, path) => {
    return await parser.countLine(path)
})

// 一键复制文本
ipcMain.handle('copy-text', async (event, txt) => {
    clipboard.writeText(txt)
})

// 读取txt文件
ipcMain.handle('read-txt', async (event, txtPath) => {
    return fs.readFileSync(path.join(templatesPath, txtPath), 'utf8')
})

// 读取模板配置文件
ipcMain.handle('read-config', async () => {
    return fs.readFileSync(path.join(templatesPath, './templates.json'), 'utf8')
})

// 复制文件夹
ipcMain.handle('copy-dir', async (event, fromPath, toPath) => {

    try {
        const copyDir = require('copy-dir')

        const finalPath = toPath + '\\导出文件\\'

        copyDir.sync(path.join(templatesPath, fromPath).toString(), path.normalize(finalPath), {
            utimes: true,  // keep add time and modify time
            mode: true,    // keep file mode
            cover: true    // cover file when exists, default is true
        })

        return finalPath
    }catch (e) {
        throw e
    }

})

// 替换某个文件的字符串
ipcMain.handle('replace-str', async (event, targetPath, data) => {
    try {
        targetPath = path.normalize(targetPath)
        let fileData = fs.readFileSync(targetPath, 'utf8');

        for (const dataKey in data) {
            fileData = fileData.replace('"' + dataKey + '"', JSON.stringify(data[dataKey]))
        }

        // 重新写入文件
        fs.writeFileSync(targetPath, fileData)
    }catch (e) {
        throw e
    }
})

// 打开目录
ipcMain.handle('open-dir', async (event, path) => {
    shell.showItemInFolder(path)
})

// 新建窗口，并打开网页文件，进行截图
ipcMain.handle('open-window', async (event, path) => {
    let newWin = new BrowserWindow({
        width: 390,
        height: 844,
        title: '请等待弹窗保存截图',
        autoHideMenuBar: true,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    newWin.loadFile(path)

    newWin.on('close', () => {
        newWin = null

        // TODO 自动删除TEMP目录

    })
})

// 获取临时目录
ipcMain.handle('get-temp', async (event) => {
    return app.getPath('temp')
})

// 打开调试模式
ipcMain.handle('open-dev-tool', async (event) => {
    win.webContents.openDevTools()
})

function checkUpdate(){
    //检测更新

    //监听'error'事件
    autoUpdater.on('error', (err) => {
        console.log(err)
    })

    //监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', (UpdateInfo) => {
        win.webContents.send('new-version', UpdateInfo)
    })

    //监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall()
        app.quit()
    })

    autoUpdater.on('download-progress', (progressObj) => {
        win.webContents.send('update-process', {
            speed: (parseInt(progressObj.bytesPerSecond) / 1000000).toFixed(2) + 'MB/s',
            percent: parseFloat(progressObj.percent).toFixed(2)
        })
    })

    autoUpdater.on('update-not-available', (info) => {
        win.webContents.send('no-update', info)
    })

    autoUpdater.checkForUpdates()
}

// 获取当前版本号
ipcMain.handle('get-version', async () => {
    return app.getVersion()
})

// 检测更新
ipcMain.handle('check-update', async () => {
    checkUpdate()
})

// 下载更新
ipcMain.handle('start-update', async () => {
    autoUpdater.downloadUpdate()
})