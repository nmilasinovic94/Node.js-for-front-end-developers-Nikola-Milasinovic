const fs = require('fs')
const path = require('path')
const sqlite3 = require('sqlite3')
const config = require('../config')

let db = null

const SCHEMA = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id       TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT    NOT NULL,
    duration    REAL    NOT NULL CHECK (duration > 0),
    date        TEXT    NOT NULL -- ISO calendar date: YYYY-MM-DD
  );

  CREATE INDEX IF NOT EXISTS idx_exercises_user_date ON exercises (user_id, date);
`

/**
 * Open the database connection and make sure the schema exists.
 */
function connect () {
  if (db) return Promise.resolve(db)

  if (config.dbFile !== ':memory:') {
    fs.mkdirSync(path.dirname(config.dbFile), { recursive: true })
  }

  return new Promise((resolve, reject) => {
    const conn = new sqlite3.Database(config.dbFile, (err) => {
      if (err) return reject(err)
      conn.exec(SCHEMA, (schemaErr) => {
        if (schemaErr) return reject(schemaErr)
        db = conn
        resolve(db)
      })
    })
  })
}

function getDb () {
  if (!db) throw new Error('Database not connected. Call connect() first.')
  return db
}

// Promise wrappers around the callback-based sqlite3 API.
// All queries use bound parameters (?) to avoid SQL injection.

function run (sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

function get (sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  })
}

function all (sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  })
}

function close () {
  if (!db) return Promise.resolve()
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err)
      db = null
      resolve()
    })
  })
}

module.exports = { connect, close, run, get, all }
