import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("meetLiteDesktop", {
  listDisplaySources: () => ipcRenderer.invoke("meetlite:list-display-sources"),
  selectDisplaySource: (sourceId) =>
    ipcRenderer.invoke("meetlite:select-display-source", sourceId),
})
