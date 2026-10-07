const path = require('path')
require('dotenv').config()

module.exports = {
  port: Number(process.env.PORT) || 3000,
  // Path to the SQLite database file. Use ":memory:" for a throwaway DB.
  dbFile: process.env.DB_FILE || path.join(__dirname, '..', '..', 'data', 'exercise-tracker.db')
}
