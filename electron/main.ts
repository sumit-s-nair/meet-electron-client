import { app, BrowserWindow } from "electron"
import type { BrowserWindowConstructorOptions } from "electron"

let win: BrowserWindow

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

    const isDev = process.env.NODE_ENV === "development"

    if (isDev) {
        win.loadURL("http://localhost:5173")
    } else {
        win.loadFile("dist/index.html")
    }
}

app.whenReady().then(createWindow)

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