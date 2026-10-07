const userModel = require('../models/userModel')
const AppError = require('../utils/AppError')
const validate = require('../validators')

const toDto = (user) => ({ username: user.username, _id: user.id })

async function createUser (input) {
  const username = validate.requiredString(input.username, 'username')

  if (await userModel.findByUsername(username)) {
    throw AppError.conflict('username already taken')
  }

  try {
    return toDto(await userModel.create(username))
  } catch (err) {
    // Guards against a race between the check above and the insert.
    if (err.code === 'SQLITE_CONSTRAINT') throw AppError.conflict('username already taken')
    throw err
  }
}

async function listUsers () {
  const users = await userModel.findAll()
  return users.map(toDto)
}

async function getUserOrFail (id) {
  const user = await userModel.findById(id)
  if (!user) throw AppError.notFound('user not found')
  return user
}

module.exports = { createUser, listUsers, getUserOrFail }
