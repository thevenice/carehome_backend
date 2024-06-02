/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application } from 'express'
import adminRoutes from './routes/adminRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'

export const app: Application = express()
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 9000
const whitelist: any[] = ['http://localhost:5173']
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(express.json())

app.get('/api', async (req: any, res: any) => {
  try {
    res.status(200).send({ data: 'HELLO WORLD | CARE HOMES APIS ARE WORKING' })
  } catch (error: any) {
    res.send({ error: error })
  }
})
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);