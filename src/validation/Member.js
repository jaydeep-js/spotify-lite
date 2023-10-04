import Joi from 'joi'
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USER_NAME_MAX_LENGTH, USER_NAME_MIN_LENGTH } from '../constants'

const common = {
  userName: Joi.string().alphanum().min(USER_NAME_MIN_LENGTH).max(USER_NAME_MAX_LENGTH).required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required()
}

export const registerSchema = {
  body: Joi.object().keys(common)
}

export const loginSchema = {
  body: Joi.object().keys(common)
}
