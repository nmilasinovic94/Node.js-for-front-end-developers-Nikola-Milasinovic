const exerciseModel = require('../models/exerciseModel')
const userService = require('./userService')
const AppError = require('../utils/AppError')
const validate = require('../validators')
const { today, formatDate } = require('../utils/date')

async function addExercise (userId, input) {
  const user = await userService.getUserOrFail(userId)

  const description = validate.requiredString(input.description, 'description')
  const duration = validate.positiveNumber(input.duration, 'duration')
  const date = validate.optional(validate.date)(input.date, 'date') || today()

  const exercise = await exerciseModel.create({ userId: user.id, description, duration, date })

  return {
    _id: user.id,
    username: user.username,
    date: formatDate(exercise.date),
    duration: exercise.duration,
    description: exercise.description
  }
}

async function getLog (userId, query) {
  const user = await userService.getUserOrFail(userId)

  const from = validate.optional(validate.date)(query.from, 'from')
  const to = validate.optional(validate.date)(query.to, 'to')
  const limit = validate.optional(validate.positiveInteger)(query.limit, 'limit')

  if (from && to && from > to) {
    throw AppError.badRequest('from must be before or equal to to')
  }

  // count reflects the whole from/to range; limit only trims the returned log.
  const [count, exercises] = await Promise.all([
    exerciseModel.countByUser(user.id, { from, to }),
    exerciseModel.findByUser(user.id, { from, to, limit })
  ])

  return {
    username: user.username,
    count,
    _id: user.id,
    log: exercises.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: formatDate(e.date)
    }))
  }
}

module.exports = { addExercise, getLog }
