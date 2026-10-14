import AuthProvider from "./contexts/AuthContext"
import PlayerProvider from "./contexts/PlayerContext"
import Paths from "./routes/Paths"

function App() {
  return (
    <>
      <PlayerProvider>
        <AuthProvider>
          <Paths />
        </AuthProvider>
      </PlayerProvider>

    </>
  )
}

export default App
