import querystring from 'querystring'

import { CLIENTERROR, INTERNALSERVERERROR, SUCCESS } from '../constants'
import { getUserPlaylist, getUserProfile, postRequest } from '../libs'
import { TokenService } from '../services'
import { sendResponse } from '../utilities'
import { middleware, spotifyConfig } from '../config'
import { verifyToken } from './Auth'
import mongoose from 'mongoose'

export const getProfile = async (req, res) => {
  try {
    const { memberId } = req.user

    const user = await TokenService.getOne({ memberId })
    if (!user) {
      return sendResponse(res, CLIENTERROR, '', {}, 'User not Exist')
    }
    const data = await getUserProfile(user)
    return sendResponse(res, SUCCESS, 'ok', { profile: data })
  } catch (error) {
    throw error
  }
}

export const getPlaylist = async (req, res) => {
  try {
    const { memberId } = req.user

    const user = await TokenService.getOne({ memberId })
    if (!user) {
      return sendResponse(res, CLIENTERROR, '', {}, 'User not Exist')
    }
    const data = await getUserPlaylist(user)
    return sendResponse(res, SUCCESS, 'ok', { playList: data })
  } catch (error) {
    throw error
  }
}

export const spotifyLogin = async (req, res) => {
  const { token } = req.query
  const { tokenStatus, data } = verifyToken(
    token,
    middleware.accessTokenSecret
  )
  const userExists = await TokenService.getOne({ memberId: data.memberId, accessToken: token })
  if (!tokenStatus || !userExists) {
    return res.redirect('/spotify/home')
  }

  const state = new mongoose.Types.ObjectId()
  const scope = 'user-read-private user-read-email playlist-read-private'

  await TokenService.updateOne({ memberId: data.memberId }, { spotifyState: state }, { upsert: true })

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotifyConfig.clientId,
      scope,
      redirect_uri: spotifyConfig.redirectUrl,
      state: state.toString()
    }))
}

export const spotifyCallback = async (req, res) => {
  const { code, state } = req.query
  const tokenDetails = await TokenService.getOne({ spotifyState: state }, { memberId: 1 })
  if (!tokenDetails) {
    return res.redirect('/spotify/auth')
  }

  const grantType = 'authorization_code'
  const url = `${spotifyConfig.tokenUrl}`
  const headers = {
    Authorization: `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    const response = await postRequest(url, { grant_type: grantType, code, redirect_uri: spotifyConfig.redirectUrl }, headers)
    const { access_token: spotifyAccessToken, refresh_token: spotifyRefreshToken } = response.data
    await TokenService.updateOne({ _id: tokenDetails._id }, { spotifyAccessToken, spotifyRefreshToken })

    res.redirect('/spotify/home')
  } catch (error) {
    return sendResponse(res, INTERNALSERVERERROR, '', {}, 'Something went wrong')
  }
}
