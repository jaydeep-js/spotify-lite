import jwt, { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import {
  CLIENTERROR,
  FORBIDDEN,
  SALT_ROUNDS,
  SUCCESS
} from '../constants'
import { MemberService, TokenService } from '../services'
import {
  getUtcTime,
  sendResponse
} from '../utilities'
import { authConfig, middleware } from '../config'

export const register = async (req, res) => {
  try {
    const { userName, password } = req.body

    const userExists = await MemberService.getOne({ userName })
    if (userExists) {
      return sendResponse(res, CLIENTERROR, '', {}, 'User already exist')
    }

    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    const newUser = await MemberService.create({
      userName,
      password: bcrypt.hashSync(password, salt)
    })

    const tokens = await generateTokens(newUser._id)
    return sendResponse(res, SUCCESS, 'Register success', { tokens })
  } catch (error) {
    throw error
  }
}

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body

    const userExists = await MemberService.getOne({ userName })
    if (!userExists) {
      return sendResponse(
        res,
        CLIENTERROR,
        '',
        {},
        'Invalid Username or password'
      )
    }

    const isValid = bcrypt.compareSync(password, userExists.password)

    if (!isValid) {
      return sendResponse(
        res,
        CLIENTERROR,
        '',
        {},
        'Invalid Username or password'
      )
    }

    const tokens = await generateTokens(userExists._id)
    return sendResponse(res, SUCCESS, 'Login success', { tokens })
  } catch (error) {
    throw error
  }
}

export const logout = async (req, res) => {
  try {
    await TokenService.updateOne({ memberId: req.user?.memberId }, { accessToken: '', refreshToken: '' })
    return sendResponse(res, SUCCESS, 'Logout success', { })
  } catch (error) {
    throw error
  }
}

const generateTokens = async (memberId) => {
  const payload = {
    memberId,
    accessTokenGenerationDateTime: getUtcTime()
  }

  const tokens = {
    accessToken: sign(payload, middleware.accessTokenSecret, {
      expiresIn: authConfig.accessTokenValidity
    }),
    refreshToken: sign(payload, middleware.refreshTokenSecret, {
      expiresIn: authConfig.refreshTokenValidity
    })
  }
  await TokenService.updateOne({ memberId }, tokens, { upsert: true })
  return tokens
}

export const checkAuthentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const accesstoken = authHeader && authHeader.split(' ')[1]

    const { data, tokenStatus } = verifyToken(
      accesstoken,
      middleware.accessTokenSecret
    )
    if (!tokenStatus) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }

    const userExists = await TokenService.getOne({ memberId: data.memberId, accessToken: accesstoken })
    if (!userExists) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }
    req.user = { ...data }
    next()
  } catch (error) {
    return sendResponse(res, FORBIDDEN, 'Invalid token', { })
  }
}

export const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const refreshToken = authHeader && authHeader.split(' ')[1]

    const { data, tokenStatus } = verifyToken(
      refreshToken,
      middleware.refreshTokenSecret
    )

    if (!tokenStatus) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }

    const userExists = await TokenService.getOne({ memberId: data.memberId, refreshToken })
    if (!userExists) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }

    const tokens = await generateTokens(data.memberId)
    return sendResponse(res, SUCCESS, 'Token generated success', { tokens })
  } catch (error) {
    return sendResponse(res, FORBIDDEN, 'Invalid token', { })
  }
}

export const validateToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const accessToken = authHeader && authHeader.split(' ')[1]

    const { tokenStatus, data } = verifyToken(
      accessToken,
      middleware.accessTokenSecret
    )
    if (!tokenStatus) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }

    const userExists = await TokenService.getOne({ memberId: data.memberId, accessToken })
    if (!userExists) {
      return sendResponse(res, FORBIDDEN, 'Invalid token', { })
    }

    return sendResponse(res, SUCCESS, 'Success', { })
  } catch (error) {
    return sendResponse(res, FORBIDDEN, 'Invalid token', { })
  }
}

export const verifyToken = (token, secret) => {
  try {
    const data = jwt.verify(token, secret)

    return {
      data,
      tokenStatus: true
    }
  } catch (error) {
    return {
      tokenStatus: false
    }
  }
}
