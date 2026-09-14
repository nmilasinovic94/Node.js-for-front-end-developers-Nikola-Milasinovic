const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
// Parse form-encoded and JSON request bodies (fCC posts form data)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// ---------- In-memory data store ----------
// users:     [{ _id, username }]
// exercises: [{ userId, description, duration, date }]  date stored as a Date object
const users = []
const exercises = []

let nextId = 1
const generateId = () => {
  // Mimic a Mongo-style hex id so responses look like the real thing
  return (Date.now().toString(16) + (nextId++).toString(16).padStart(6, '0')).padStart(24, '0')
}

// ---------- Routes ----------

// Create a new user
app.post('/api/users', (req, res) => {
  const username = req.body.username
  if (!username) {
    return res.status(400).json({ error: 'username is required' })
  }

  const user = { _id: generateId(), username }
  users.push(user)

  res.json({ username: user.username, _id: user._id })
})

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users.map((u) => ({ username: u.username, _id: u._id })))
})

// Add an exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params
  const user = users.find((u) => u._id === _id)
  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  const { description, duration } = req.body
  if (!description || !duration) {
    return res.status(400).json({ error: 'description and duration are required' })
  }

  const durationNum = Number(duration)
  if (Number.isNaN(durationNum)) {
    return res.status(400).json({ error: 'duration must be a number' })
  }

  // Default to now if no date provided; otherwise parse the given date
  const date = req.body.date ? new Date(req.body.date) : new Date()
  if (date.toString() === 'Invalid Date') {
    return res.status(400).json({ error: 'invalid date' })
  }

  const exercise = {
    userId: user._id,
    description: String(description),
    duration: durationNum,
    date
  }
  exercises.push(exercise)

  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: exercise.duration,
    description: exercise.description
  })
})

// Get a user's exercise log, with optional from/to/limit filters
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params
  const user = users.find((u) => u._id === _id)
  if (!user) {
    return res.status(400).json({ error: 'user not found' })
  }

  const { from, to, limit } = req.query

  let log = exercises.filter((e) => e.userId === user._id)

  if (from) {
    const fromDate = new Date(from)
    if (fromDate.toString() !== 'Invalid Date') {
      log = log.filter((e) => e.date >= fromDate)
    }
  }

  if (to) {
    const toDate = new Date(to)
    if (toDate.toString() !== 'Invalid Date') {
      log = log.filter((e) => e.date <= toDate)
    }
  }

  if (limit) {
    const limitNum = Number(limit)
    if (!Number.isNaN(limitNum)) {
      log = log.slice(0, limitNum)
    }
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString()
    }))
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
