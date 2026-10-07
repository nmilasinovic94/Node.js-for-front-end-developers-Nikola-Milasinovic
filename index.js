const app = require('./src/app')
const config = require('./src/config')
const db = require('./src/db/database')

async function start () {
  await db.connect()

  const server = app.listen(config.port, () => {
    console.log('Your app is listening on port ' + server.address().port)
  })

  const shutdown = () => {
    server.close(async () => {
      await db.close()
      process.exit(0)
    })
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
