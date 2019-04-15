import {
  app,
  BrowserWindow,
  session,
  Tray,
  Menu,
  dialog
} from 'electron'

import pkg from './../../package'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, tray, isHide = false;
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {


  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: `default-src 'self'`
  //   })
  // })
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: { //跨域文件解决
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('hide', () => {
    isHide = true;
  })
  mainWindow.on('show', () => {
    isHide = false;
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  createTray();
}
/**
 * 定会最小化图标
 *
 * @return  {[type]}  [return description]
 */
function createTray() {
  const menubarPic = process.platform === 'darwin' ? `${__static}/menubar_nodarwin_16.png` : `${__static}/menubar-nodarwin_16.png`
  tray = new Tray(menubarPic) // 指定图片的路径
  tray.on('right-click', (e) => { // 右键点击
    if (!isHide)
      mainWindow.hide() // 隐藏小窗口
    else
      mainWindow.show()
  })

  const contextMenu = Menu.buildFromTemplate([{
      label: '置顶',
      type: 'checkbox',
      accelerator: 'CmdOrCtrl+T',
      click(e) {
        mainWindow.alwaysOnTop = e.checked;
      },

    },
    {
      label: '关于',
      click() {
        dialog.showMessageBox({
          title: '地图助手',
          message: '地图助手',
          detail: `Version: ${pkg.version}\nAuthor: seelingzheng\nGithub: https://github.com/seelingzheng/map_helper`
        })
      }
    },
    {
      type: 'separator'
    }

    , {
      label: '退出',
      accelerator: 'CmdOrCtrl+Q',
      click() {
        app.quit()
      }
    }
  ]);


  tray.setToolTip('地图助手')
  tray.setContextMenu(contextMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */