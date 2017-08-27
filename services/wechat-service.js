const APP_ID = "wx835a27791573bbb8"
const APP_SECRET = "0586510c02305208e339d6b03df4cfc6"
const axios = require('axios')
const Errors = require('../error')
const redis = require('redis_service')
const WECHAT_USER_ACCESS_TOKEN_BY_CODE_PRE = 'wechat_user_access_token_by_code:'
const WECHAT_USER_REFRESH_TOKEN_BY_CODE_PRE = 'wechat_user_refresh_token_by_code:'

async function getAccessTokenByCode(code) {
  if (!code) throw new Errors.ValidationError('code', 'code can not be empty')
  let tokenObj = getAccessTokenFromCache(code)
  if (!tokenObj) {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`
    tokenObj = axios.get(url)
        .then(r => {
          if (!r || !r.data) throw new Errors.WechatAPIError('invalid wechat api reponse')
          return r.data
        })
  }
  await saveAccessToken(code, tokenObj)
  await saveAccessToken(code, tokenObj.refresh_token)
  return tokenObj
}

async function saveRefeshToken(code, refeshToken) {
  if (!code) throw new Errors.ValidationError('code', 'code can not be empty')
  if (!refeshToken) throw new Errors.ValidationError('refeshToken', 'refeshToken can not be empty')
  await redis.set(WECHAT_USER_REFRESH_TOKEN_BY_CODE_PRE + code, tokenObj.access_token)
      .catch(e => {
        throw new Errors.RedisError(`set wechat user refresh token failed: ${e.message}`)
      })
  await redis.expire(WECHAT_USER_REFRESH_TOKEN_BY_CODE_PRE + code, 28 * 24 * 60 * 60)
      .catch(e => {
        throw new Errors.RedisError(`set wechat user refresh token failed: ${e.message}`)
      })
}

async function saveAccessToken(code, tokenObj) {
  if (!code) throw new Errors.ValidationError('code', 'code can not be empty')
  if (!tokenObj || !tokenObj.access_token) throw new Errors.ValidationError('access_token', 'access_token can not be empty')
  await redis.set(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PRE + code, tokenObj.access_token)
      .catch(e => {
        throw new Errors.RedisError(`set wechat user access token failed: ${e.message}`)
      })
  await redis.expire(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PRE + code, 7000)
      .catch(e => {
        throw new Errors.RedisError(`set wechat user access token failed: ${e.message}`)
      })
}

async function getAccessTokenFromCache(code) {
  let accessToken = await redis.get(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PRE + code, tokenObj.access_token)
      .catch(e => {
        throw new Errors.RedisError(`set wechat user access token failed: ${e.message}`)
      })
  if (!accessToken) {
    let refreshToken = await redis.get(WECHAT_USER_REFRESH_TOKEN_BY_CODE_PRE + code)
        .catch(e => {
          throw new Errors.RedisError(`set wechat user refresh token failed: ${e.message}`)
        })
    if(!refreshToken) return null
    if(refreshToken) {
      const tokenObj = await refeshAccessToken(code)
      return tokenObj
    }
  }
  return {refreshToken,accessToken}
}

async function refeshAccessToken(refeshToken) {
  const url = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${APP_ID}&grant_type=refresh_token&refresh_token=${refeshToken}`
  var tokenObj = axios.get(url)
      .then(r => {
        if (!r || !r.data) throw new Errors.WechatAPIError('invalid wechat api reponse')
        return r.data
      })
  return tokenObj
}

module.exports = {
  getAccessTokenByCode
}