const logger = require('../util/logger').reqLogger

function logRequests(options) {
  return function (req, res, next) {
    const content = {
      method: req.method,
      originalUrl: req.originalUrl,
      body: req.body,
      query: req.query,
      ip: req.ip || req.ips || req.get('X-Real_Ip'),
      user: req.user || undefined,
      httpStatusCode: res.statusCode
    }
    logger.info('request', content)
    next()
  }
}

module.exports = {
  logRequests
}