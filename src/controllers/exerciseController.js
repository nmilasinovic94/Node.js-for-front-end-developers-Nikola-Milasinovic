const exerciseService = require('../services/exerciseService')

async function create (req, res) {
  const result = await exerciseService.addExercise(req.params._id, req.body)
  res.status(201).json(result)
}

async function getLog (req, res) {
  res.json(await exerciseService.getLog(req.params._id, req.query))
}

module.exports = { create, getLog }
