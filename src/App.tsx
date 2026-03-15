import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./components/AppLayout"
import Home from "./pages/Home"
import Meeting from "./pages/Meeting"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/meetings/:roomId"
          element={
            <AppLayout centerContent={false} containerClassName="h-[100dvh] overflow-hidden p-0">
              <Meeting />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
