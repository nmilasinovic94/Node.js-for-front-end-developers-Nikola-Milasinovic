const { Router } = require('express')
const asyncHandler = require('../middleware/asyncHandler')
const userController = require('../controllers/userController')
const exerciseController = require('../controllers/exerciseController')

const router = Router()

router.post('/', asyncHandler(userController.create))
router.get('/', asyncHandler(userController.list))
router.post('/:_id/exercises', asyncHandler(exerciseController.create))
router.get('/:_id/logs', asyncHandler(exerciseController.getLog))

module.exports = router
