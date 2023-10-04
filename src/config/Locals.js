import { config } from 'dotenv'
config()

export const env = process.env.NODE_ENV || 'development'
export const port = process.env.PORT || 8000
export const appURL = process.env.APP_URL || 'http://localhost:8000/spotify'

export const middleware = {
  bodySizeLimit: process.env.BODY_SIZE_LIMIT || '50mb',
  bodyParameterLimit: process.env.BODY_PARAMETER_LIMIT || '5000',
  methodsAllowed: process.env.METHOD_ALLOWED ? process.env.METHOD_ALLOWED.split(',') : ['GET', 'POST', 'PUT', 'DELETE'],
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
}

export const mongoose = {
  connectionUri: process.env.MONGO_CONNECTION_URL || 'mongodb://localhost:27017/spotify',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}

export const authConfig = {
  accessTokenValidity: process.env.ACCESS_TOKEN_VALIDITY || '24h',
  refreshTokenValidity: process.env.REFRESH_TOKEN_VALIDITY || '30d'
}

export const spotifyConfig = {
  tokenUrl: 'https://accounts.spotify.com/api/token',
  baseUrl: 'https://api.spotify.com/v1',
  redirectUrl: 'http://localhost:8000/spotify/callback',
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
}
