const crypto = require('crypto')
const db = require('../db/database')

// Mongo-style 24-char hex id, kept for compatibility with the fCC API shape.
const generateId = () => crypto.randomBytes(12).toString('hex')

async function create (username) {
  const id = generateId()
  await db.run('INSERT INTO users (id, username) VALUES (?, ?)', [id, username])
  return { id, username }
}

function findById (id) {
  return db.get('SELECT id, username FROM users WHERE id = ?', [id])
}

function findByUsername (username) {
  // Column is COLLATE NOCASE, so this comparison is case-insensitive.
  return db.get('SELECT id, username FROM users WHERE username = ?', [username])
}

function findAll () {
  return db.all('SELECT id, username FROM users ORDER BY rowid ASC')
}

module.exports = { create, findById, findByUsername, findAll }
