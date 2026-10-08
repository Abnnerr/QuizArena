import AuthProvider from "./contexts/AuthContext"
import Paths from "./routes/Paths"

function App() {
  return (
    <>
      <AuthProvider>
        <Paths />
      </AuthProvider>
    </>
  )
}

export default App
