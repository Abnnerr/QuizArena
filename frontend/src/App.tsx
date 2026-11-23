import AuthProvider from "./contexts/AuthContext"

import PlayerProvider from "./contexts/PlayerContext"
import RoomProvider from "./contexts/RoomContext"
import ThemeProvider from "./contexts/ThemeContext"
import { ToastProvider } from "./contexts/ToastContext"
import Paths from "./routes/Paths"
import Toast from "./shared/ui/Toast"

function App() {
  return (
    <>
      <ToastProvider>
        <ThemeProvider>
          <PlayerProvider>
            <AuthProvider>
              <RoomProvider>
                <Paths />
                <Toast position="bottom-right"/>
              </RoomProvider>
            </AuthProvider>
          </PlayerProvider>
        </ThemeProvider>
      </ToastProvider>
    </>
  )
}

export default App
