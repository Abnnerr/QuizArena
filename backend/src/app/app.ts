import express from 'express'
import cors from 'cors'
import routes from "./routes.js"
import helmet from 'helmet'
import crypto from "node:crypto";
import cookieParser from "cookie-parser"
import { pinoHttp } from 'pino-http'
import { logger } from '../shared/utils/logger.js'

const app = express()

app.use(pinoHttp({
    logger,

    genReqId: (req) => {
        return req.headers["x-request-id"]?.toString()
            || crypto.randomUUID();
    }
}));

app.use(express.json({ limit: '100kb', strict: true }))
app.use(cookieParser());
// app.use(RateLimit.limit(100, 15))
app.use(helmet())
app.use(cors({
    origin: ["https://quiz-arena-zeta-ten.vercel.app", "http://localhost:5173"],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true
}))


app.use('/api', routes)


export default app