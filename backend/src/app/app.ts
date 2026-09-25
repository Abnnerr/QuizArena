import express from 'express'
import cors from 'cors'
import routes from "./routes.js"
import helmet from 'helmet'
const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors({
    origin: '',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true
}))


app.use('/api', routes)


export default app