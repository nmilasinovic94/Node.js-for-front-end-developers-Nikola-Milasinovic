const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

const pad = (n) => String(n).padStart(2, '0')

const toIsoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/**
 * Parses user input into a calendar date string (YYYY-MM-DD).
 * Returns null when the value isn't a real date.
 */
function parseDate (value) {
  const str = String(value).trim()
  const match = ISO_DATE.exec(str)

  if (match) {
    const [, y, m, d] = match.map(Number)
    const date = new Date(y, m - 1, d)
    // Reject overflowed values like 2021-02-31
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
    return toIsoDate(date)
  }

  const date = new Date(str)
  return Number.isNaN(date.getTime()) ? null : toIsoDate(date)
}

const today = () => toIsoDate(new Date())

// "2016-01-01" -> "Fri Jan 01 2016" (built in local time so the day never shifts)
function formatDate (isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toDateString()
}

module.exports = { parseDate, today, formatDate }
