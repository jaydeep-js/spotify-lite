const BASE_URL = 'http://localhost:8000/spotify'

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form')
  const registerForm = document.getElementById('register-form')

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userName = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      })

      const res = await response.json()

      if (res.success) {
        const { tokens } = res.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        alert(res.message)
        window.location.href = `${BASE_URL}/login?token=${tokens.accessToken}`
      } else {
        alert(res.error)
      }
    } catch (error) {
      console.log(error)
    }
  })

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userName = document.getElementById('register-username').value
    const password = document.getElementById('register-password').value

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
      })

      const res = await response.json()

      if (res.success) {
        const { tokens } = res.data
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        alert(res.message)
        window.location.href = `${BASE_URL}/login?token=${tokens.accessToken}`
      } else {
        alert(res.error)
      }
    } catch (error) {
      console.error(error)
    }
  })
})
