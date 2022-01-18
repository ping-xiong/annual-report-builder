'use strict'

import {app, protocol, BrowserWindow, ipcMain, shell, dialog, clipboard } from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import * as path from "path"

import parser from '@/util/background/qq/parser'

const isDevelopment = process.env.NODE_ENV !== 'production'

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

// 处理文件
ipcMain.handle('qq-report', async (event, path, lineCount, setting, commonSetting) => {
    parser.parse(path, lineCount, setting, win, commonSetting, logger)
    console.log(path, lineCount, setting)
})

// 获取行数
ipcMain.handle('count-line', async (event, path) => {
    return await parser.countLine(path)
})

// 一键复制文本
ipcMain.handle('copy-text', async (event, txt) => {
    clipboard.writeText(txt)
})
