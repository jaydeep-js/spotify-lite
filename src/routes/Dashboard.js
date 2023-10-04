import { Router } from 'express'

import { checkAuthentication, getPlaylist, getProfile, spotifyCallback, spotifyLogin } from '../controller'
import { asyncWrapper } from '../utilities'

const DashboardRoutes = new Router()

DashboardRoutes.get('/home', (req, res) => {
  res.render('home')
})

DashboardRoutes.get('/profile', (req, res) => {
  res.render('profile')
})

DashboardRoutes.get('/playlist', (req, res) => {
  res.render('playlists')
})

DashboardRoutes.post('/profile', checkAuthentication, asyncWrapper(getProfile))
DashboardRoutes.post('/playlist', checkAuthentication, asyncWrapper(getPlaylist))

DashboardRoutes.get('/login', spotifyLogin)
DashboardRoutes.get('/callback', spotifyCallback)

export { DashboardRoutes }
