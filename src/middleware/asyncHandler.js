// Express 4 doesn't forward rejected promises to error middleware; this does.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
