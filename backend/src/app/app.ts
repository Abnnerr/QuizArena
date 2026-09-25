import express from 'express'
import cors from 'cors'
import routes from "./routes.js"
import helmet from 'helmet'
const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())


app.use('/api', routes)


export default app