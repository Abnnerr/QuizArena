import { Server } from "socket.io";
import app from "./app.js";
import http from "node:http"

const PORT = process.env.PORT

const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id)

    socket.on("join_room", ({ roomId }) => {
        socket.join(`room:${roomId}`)

        console.log(
            `Socket ${socket.id} entrou na sala ${roomId}`
        )
    })

    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id)
    })
})

httpServer.listen(PORT, () => {
    console.log(`backend rodando http://localhost:${PORT}`)
})