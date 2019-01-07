class QA4UError extends Error { }
class NotFoundError extends Error { }
class NotAuthorizedError extends Error { }

module.exports = {
  QA4UError : QA4UError,
  NotFoundError : NotFoundError,
  NotAuthorizedError : NotAuthorizedError,
}
