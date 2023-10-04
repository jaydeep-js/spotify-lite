import { Router } from 'express'

import { register, login, refreshToken, validateToken, logout, checkAuthentication } from '../controller'
import { asyncWrapper, validateInput } from '../utilities'
import { loginSchema, registerSchema } from '../validation'

const AuthRoutes = new Router()

AuthRoutes.get('/', (req, res) => {
  res.render('auth')
})

AuthRoutes.post('/register', validateInput(registerSchema), asyncWrapper(register))
AuthRoutes.post('/login', validateInput(loginSchema), asyncWrapper(login))
AuthRoutes.get('/refreshToken', asyncWrapper(refreshToken))
AuthRoutes.get('/validate', asyncWrapper(validateToken))
AuthRoutes.get('/logout', checkAuthentication, asyncWrapper(logout))

export { AuthRoutes }
