const userService = require('../services/userService')

async function create (req, res) {
  const user = await userService.createUser(req.body)
  res.status(201).json(user)
}

async function list (req, res) {
  res.json(await userService.listUsers())
}

module.exports = { create, list }
