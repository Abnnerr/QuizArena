import AuthProvider from "./contexts/AuthContext"

import PlayerProvider from "./contexts/PlayerContext"
import RoomProvider from "./contexts/RoomContext"
import ThemeProvider from "./contexts/ThemeContext"
import Paths from "./routes/Paths"

function App() {
  return (
    <>
      <ThemeProvider>
          <PlayerProvider>
            <AuthProvider>
              <RoomProvider>
                <Paths />
              </RoomProvider>
            </AuthProvider>
          </PlayerProvider>
      </ThemeProvider>
    </>
  )
}

export default App
