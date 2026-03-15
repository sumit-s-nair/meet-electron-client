import { app, BrowserWindow, desktopCapturer, session } from "electron"
import type { BrowserWindowConstructorOptions } from "electron"

let win: BrowserWindow

app.whenReady().then(() => {
    const defaultSession = session.defaultSession
    const isMac = process.platform === "darwin"
    const macMajorVersion = Number.parseInt(process.getSystemVersion().split(".")[0] ?? "0", 10)

    defaultSession.setPermissionCheckHandler((_webContents, permission) => {
        if (permission === "media") {
            return true
        }

        return false
    })

    defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
        if (permission === "media" || permission === "display-capture") {
            callback(true)
            return
        }

        callback(false)
    })
    
    defaultSession.setDisplayMediaRequestHandler(
        async (request, callback) => {
            const sources = await desktopCapturer.getSources({ types: ["screen", "window"] })
            const fallbackSource = sources[0]

            if (!fallbackSource) {
                callback({})
                return
            }

            callback({
                video: fallbackSource,
                audio: request.audioRequested && process.platform === "win32" ? "loopback" : undefined,
            })
        },
        isMac && macMajorVersion >= 15 ? { useSystemPicker: true } : undefined,
    )

    createWindow()
})

function createWindow() {
    const isMac = process.platform === "darwin"
    const isWindows = process.platform === "win32"
    const appTitle = "Meet Electron Client"

    const windowOptions: BrowserWindowConstructorOptions = {
        title: appTitle,
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 700,
        autoHideMenuBar: true,
        show: false,
        backgroundColor: "#0f172a",
    }

    if (isMac) {
        // Keep native title bar on macOS so title and traffic lights are always visible.
        windowOptions.titleBarStyle = "default"
    }

    if (isWindows) {
        // Keep native caption/title text and add Windows 11 material when available.
        windowOptions.titleBarStyle = "default"
        windowOptions.backgroundMaterial = "mica"
    }

    win = new BrowserWindow(windowOptions)

    win.on("page-title-updated", (event) => {
        // Avoid renderer title updates clearing the app window title.
        event.preventDefault()
        win.setTitle(appTitle)
    })

    win.once("ready-to-show", () => {
        win.setTitle(appTitle)
        win.show()
    })

    const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? "http://localhost:5173"
    const packagedAppUrl = process.env.ELECTRON_START_URL ?? "https://meet-lite.vercel.app/"

    if (!app.isPackaged) {
        win.loadURL(devServerUrl)
    } else {
        win.loadURL(packagedAppUrl)
    }
}

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})