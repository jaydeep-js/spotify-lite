import Joi from 'joi'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { INVALIDREQ, SUCCESS } from '../../constants'

export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

/**
 * @param {Object} res response Object
 * @param {Number} status status code Default=""
 * @param {String} message Common message Default=""
 * @param {Object} data Data that you want to send Default={}
 * @param {String} error Error code from ErrorCode.json Default=""
 */
export const sendResponse = (res, status = SUCCESS, message = '', data = {}, error = '') => {
  res.status(status).send({
    status,
    success: status < INVALIDREQ,
    message,
    data,
    error
  })
}

export const validateInput = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body'])
  const object = pick(req, Object.keys(validSchema))
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object)
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ')
    return sendResponse(res, INVALIDREQ, 'Invalid request', {}, errorMessage)
  }
  Object.assign(req, value)
  return next()
}

export const getUtcTime = (date = new Date()) => {
  dayjs.extend(utc)
  return dayjs(date).utc().format()
}
