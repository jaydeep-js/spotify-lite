import { model, Schema } from 'mongoose'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_NAME_MIN_LENGTH } from '../constants'

const MemberSchema = new Schema({
  userName: { type: String, required: true, unique: true, min: USER_NAME_MIN_LENGTH, max: USER_NAME_MAX_LENGTH },
  password: { type: String, required: true, min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
  spotifyAccessToken: { type: String },
  spotifyState: { type: String }

}, {
  timestamps: true
}
)

export const MemberModel = model('member', MemberSchema)
