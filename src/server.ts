import { app } from './app'
import { connectToDB } from './configs/db.config'

let server
const port = process.env.PORT || 9091

async function main() {
  await connectToDB()
  server = await app.listen(port)
  console.log(`\n Server Running On The Port ${port} ⚡️`)
}

main()

export default { server }
