const db = require('../db/database')

async function create ({ userId, description, duration, date }) {
  const { lastID } = await db.run(
    'INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)',
    [userId, description, duration, date]
  )
  return { id: lastID, userId, description, duration, date }
}

// Builds the shared WHERE clause for the date-range filter.
function buildRangeFilter (userId, { from, to }) {
  const clauses = ['user_id = ?']
  const params = [userId]
  if (from) {
    clauses.push('date >= ?')
    params.push(from)
  }
  if (to) {
    clauses.push('date <= ?')
    params.push(to)
  }
  return { where: clauses.join(' AND '), params }
}

/**
 * Exercises for a user within [from, to], sorted by date ascending,
 * then truncated to `limit`. Dates are stored as YYYY-MM-DD so string
 * comparison and ordering match chronological order.
 */
function findByUser (userId, { from, to, limit } = {}) {
  const { where, params } = buildRangeFilter(userId, { from, to })
  let sql = `SELECT description, duration, date FROM exercises WHERE ${where} ORDER BY date ASC, id ASC`
  if (limit) {
    sql += ' LIMIT ?'
    params.push(limit)
  }
  return db.all(sql, params)
}

/**
 * Number of exercises within [from, to], independent of any limit.
 */
async function countByUser (userId, { from, to } = {}) {
  const { where, params } = buildRangeFilter(userId, { from, to })
  const row = await db.get(`SELECT COUNT(*) AS count FROM exercises WHERE ${where}`, params)
  return row.count
}

module.exports = { create, findByUser, countByUser }
