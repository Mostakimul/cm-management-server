import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import router from './app/routes'

const app: Application = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
)

// application routes
app.use('/api/v1', router)

const test = (req: Request, res: Response) => {
  res.send('Hello World!')
}
app.get('/', test)

app.use(globalErrorHandler)
app.use(notFound)

export default app
