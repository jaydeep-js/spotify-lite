import { model, Schema } from 'mongoose'

const TokenSchema = new Schema({
  spotifyAccessToken: { type: String },
  spotifyRefreshToken: { type: String },
  spotifyState: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  memberId: { type: String, required: true, unique: true }
}, {
  timestamps: true
}
)

export const TokenModel = model('tokens', TokenSchema)
