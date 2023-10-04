import { spotifyConfig } from '../config/Locals'
import { UNAUTHORISED } from '../constants'
import { TokenService } from '../services'
import { getRequest, postRequest } from './Http'

export const getUserProfile = async (token) => {
  try {
    const url = `${spotifyConfig.baseUrl}/me`
    const headers = {
      Authorization: `Bearer ${token.spotifyAccessToken}`
    }

    let response = await getRequest(url, headers)

    if (response.status === UNAUTHORISED) {
      const newToken = await refreshToken(token)
      const headers = {
        Authorization: `Bearer ${newToken.spotifyAccessToken}`
      }
      response = await getRequest(url, headers)
    }
    return response.data
  } catch (error) {
    throw error
  }
}

export const getUserPlaylist = async (token) => {
  try {
    const url = `${spotifyConfig.baseUrl}/me/playlists`
    const headers = {
      Authorization: `Bearer ${token.spotifyAccessToken}`
    }

    let response = await getRequest(url, headers)
    if (response.status === UNAUTHORISED) {
      const newToken = await refreshToken(token)
      const headers = {
        Authorization: `Bearer ${newToken.spotifyAccessToken}`
      }
      response = await getRequest(url, headers)
    }
    return response.data
  } catch (error) {
    throw error
  }
}

const refreshToken = async (token) => {
  try {
    const grantType = 'refresh_token'
    const url = `${spotifyConfig.tokenUrl}`
    const headers = {
      Authorization: `Basic ${Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const response = await postRequest(url, { grant_type: grantType, refresh_token: token.spotifyRefreshToken }, headers)

    if (response.status === 200) {
      const { access_token: spotifyAccessToken } = response.data
      return await TokenService.updateOne({ _id: token._id }, { spotifyAccessToken })
    } else {
      throw new Error('Token expired')
    }
  } catch (error) {
    throw error
  }
}
