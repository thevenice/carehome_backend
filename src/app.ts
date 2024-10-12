/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application } from 'express'
import adminRoutes from './routes/adminRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config()
export const app: Application = express()

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
const port = process.env.PORT || 9000
const whitelist: any[] = ['http://localhost:5173', 'http://localhost:5174']
const corsOptions = {
  credentials: true,
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
app.use(
  '/logo/data',
  express.static(
    path.join(
      '/Users/prakashpawar/Documents/prakash/carehome/carehome_backend',
      '/uploads/care-home-logo',
    ),
  ),
)
app.use(
  '/profile_picture/data',
  express.static(
    path.join(
      '/Users/prakashpawar/Documents/prakash/carehome/carehome_backend',
      '/uploads/profile_pictures',
    ),
  ),
)
app.use(
  '/documents/data',
  express.static(
    path.join(
      '/Users/prakashpawar/Documents/prakash/carehome/carehome_backend',
      '/uploads/user-docs',
    ),
  ),
)

// Static route for care plan PDFs
app.use(
  '/care-plan-pdfs/data',
  express.static(
    path.join(
      '/Users/prakashpawar/Documents/prakash/carehome/carehome_backend',
      '/uploads/pdfs'
    )
  )
);

// Static route for care plan images (both featured and media images)
app.use(
  '/care-plan-images/data',
  express.static(
    path.join(
      '/Users/prakashpawar/Documents/prakash/carehome/carehome_backend',
      '/uploads/images'
    )
  )
);

app.use(express.json())

app.get('/api', async (req: any, res: any) => {
  try {
    res.status(200).send({ data: 'HELLO WORLD | CARE HOMES APIS ARE WORKING' })
  } catch (error: any) {
    res.send({ error: error })
  }
})
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
