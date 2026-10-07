const AppError = require('../utils/AppError')
const { parseDate } = require('../utils/date')

const isBlank = (v) => v === undefined || v === null || String(v).trim() === ''

function requiredString (value, field) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw AppError.badRequest(`${field} is required`)
  }
  const trimmed = String(value).trim()
  if (!trimmed) throw AppError.badRequest(`${field} is required`)
  return trimmed
}

function positiveNumber (value, field) {
  if (isBlank(value)) throw AppError.badRequest(`${field} is required`)
  const num = Number(String(value).trim())
  if (!Number.isFinite(num) || num <= 0) {
    throw AppError.badRequest(`${field} must be a positive number`)
  }
  return num
}

function positiveInteger (value, field) {
  const num = Number(String(value).trim())
  if (!Number.isInteger(num) || num <= 0) {
    throw AppError.badRequest(`${field} must be a positive integer`)
  }
  return num
}

function date (value, field) {
  const parsed = parseDate(value)
  if (!parsed) throw AppError.badRequest(`${field} must be a valid date (yyyy-mm-dd)`)
  return parsed
}

// Returns undefined for missing/blank values so optional params can be skipped.
const optional = (validator) => (value, field) => (isBlank(value) ? undefined : validator(value, field))

module.exports = {
  requiredString,
  positiveNumber,
  positiveInteger,
  date,
  optional
}
