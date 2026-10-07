// Error carrying an HTTP status, thrown by services and rendered by the error middleware.
class AppError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }

  static badRequest (message) { return new AppError(400, message) }
  static notFound (message) { return new AppError(404, message) }
  static conflict (message) { return new AppError(409, message) }
}

module.exports = AppError
