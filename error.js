class BaseHTTPError extends Error {
  constructor(msg, OPCode, httpCode, httpMsg) {
    super(msg)
    this.OPCode = OPCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'BaseHTTPError'
  }

  static get['DEFAULT_OPCODE']() {
    return 100000
  }
}

class InternalError extends BaseHTTPError {
  constructor(msg) {
    const OPCode = 1000001
    const httpMsg = '服务器好像开小差看,一会再试试？'
    super(msg, OPCode, 500, httpMsg)
  }
}


class ValidationError extends BaseHTTPError {
  constructor(path, reason) {
    const OPCode = 2000000
    const httpCode = 400
    super(`error validating parm, path:${path},reason: ${reason}`, OPCode, httpCode, '参数错误，清检查后再试~')
    this.name = 'ValidationError'
  }
}


class DuplicatedUserNameError extends ValidationError {
  constructor(username) {
    const OPCode = 2000001
    super('username', `duplicate user name: ${username}`)
    this.httpMsg = '这个昵称已经存在,换一个吧~~~'
  }
}

class WechatAPIError extends BaseHTTPError {
  constructor(msg) {
    const httpMsg = '微信服务调用失败'
    super(`wechat api err:${msg}`, 3000001, 500, httpMsg)
  }
}

class RedisError extends BaseHTTPError {
  constructor(msg) {
    const httpMsg = '服务器内部异常'
    super(`redis err:${msg}`, 4000001, 500, httpMsg)
  }
}

module.exports = {
  BaseHTTPError,
  ValidationError,
  DuplicatedUserNameError,
  InternalError,
  WechatAPIError,
  RedisError
}