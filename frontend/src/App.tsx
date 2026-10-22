import AuthProvider from "./contexts/AuthContext"
import PlayerProvider from "./contexts/PlayerContext"
import RoomProvider from "./contexts/RoomContext"
import Paths from "./routes/Paths"

function App() {
  return (
    <>
      <PlayerProvider>
        <AuthProvider>
          <RoomProvider>
            <Paths />
          </RoomProvider>
        </AuthProvider>
      </PlayerProvider>

    </>
  )
}

export default App
