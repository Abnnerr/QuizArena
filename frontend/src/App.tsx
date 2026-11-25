import { BrowserRouter } from "react-router"

import Paths from "./routes/Paths"
import Toast from "./shared/ui/Toast"
import { ToastProvider } from "./contexts/provider/ToastProvider"
import ThemeProvider from "./contexts/provider/ThemeProvider"
import PlayerProvider from "./contexts/provider/PlayerProvider"
import AuthProvider from "./contexts/provider/AuthProvider"
import RoomProvider from "./contexts/provider/RoomProvider"

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastProvider>
          <ThemeProvider>
            <PlayerProvider>
              <AuthProvider>
                <RoomProvider>
                  <Paths />
                  <Toast position="bottom-right" />
                </RoomProvider>
              </AuthProvider>
            </PlayerProvider>
          </ThemeProvider>
        </ToastProvider>
      </BrowserRouter>
    </>
  )
}

export default App
