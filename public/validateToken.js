const BASE_URL = 'http://localhost:8000/spotify'

async function validateToken () {
  const accessToken = localStorage.getItem('accessToken')
  const response = await fetch(`${BASE_URL}/auth/validate`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const { status } = await response.json()

  if (status === 200) {
    document.getElementById('container').style.display = 'block'
  } else {
    refreshAccessToken()
  }
}

async function refreshAccessToken () {
  const refreshToken = localStorage.getItem('refreshToken')

  const response = await fetch(`${BASE_URL}/auth/refreshToken`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  })
  const { data } = await response.json()
  if (data.tokens) {
    localStorage.setItem('accessToken', data.tokens.accessToken)
    localStorage.setItem('refreshToken', data.tokens.refreshToken)
    validateToken()
  } else {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = `${BASE_URL}/auth`
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await validateToken()

  document.getElementById('profile').addEventListener('click', async (e) => {
    e.preventDefault()
    window.location.href = `${BASE_URL}/profile`
  })

  document.getElementById('playlist').addEventListener('click', async (e) => {
    e.preventDefault()
    window.location.href = `${BASE_URL}/playlist`
  })

  document.getElementById('logout').addEventListener('click', async (e) => {
    try {
      e.preventDefault()
      const accessToken = localStorage.getItem('accessToken')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      window.location.href = `${BASE_URL}/auth`
    } catch (error) {
      window.location.href = `${BASE_URL}/auth`
    }
  })
})
