class BaseHTTPError extends Error {
  constructor(msg, OPCode, httpCode, httpMsg) {
    super(msg)
    this.OPCode = OPCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'BaseHTTPError'
  }

  static get['DEFAULT_OPCODE'] () {
    return 100000
  }
}

class ValidationError extends BaseHTTPError {
  constructor(path, reason) {
    const OPCode = 1000001
    const httpCode = 400
    super(`error validating parm, path:${path},reason: ${reason}`,OPCode,httpCode,'参数错误，清检查后再试~')
    this.name = 'ValidationError'
  }
}


class DuplicatedUserNameError extends ValidationError {
  constructor(username) {
    super('username',`duplicate user name: ${username}`)
    this.httpMsg = '这个昵称已经存在'
  }
}

module.exports = {
  BaseHTTPError,
  ValidationError,
  DuplicatedUserNameError
}