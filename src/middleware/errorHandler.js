const AppError = require('../utils/AppError')

function notFound (req, res) {
  res.status(404).json({ error: 'not found' })
}

// eslint-disable-next-line no-unused-vars
function errorHandler (err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message })
  }
  // Malformed JSON body from express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON body' })
  }
  console.error(err)
  res.status(500).json({ error: 'internal server error' })
}

module.exports = { notFound, errorHandler }
