import { AuthRoutes } from './Auth'
import { DashboardRoutes } from './Dashboard'

const Routes = [
  { path: '', router: DashboardRoutes },
  { path: '/auth', router: AuthRoutes }
]

Routes.init = (app) => {
  try {
    app.get('/spotify/health-check', (req, res) => res.send('working'))
    Routes.forEach(route => {
      app.use(['/spotify', route.path].join(''), route.router)
    })
  } catch (error) {
    throw error
  }
}

export { Routes }
