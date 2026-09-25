import app from "./app.js";

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`backend rodando http://localhost:${PORT}`)
})