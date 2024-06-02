import mongoose from 'mongoose'

export const connectToDB = async () => {
  const options = {
    autoIndex: true,
  }
  console.log('process.env.DATABASE_URI!', process.env.DATABASE_URI!)
  await mongoose.connect(process.env.DATABASE_URI!, options)
  await console.log('\n Success | Connected To DB 📈')
}
