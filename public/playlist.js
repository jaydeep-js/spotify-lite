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
  try {
    await validateToken()
    const accessToken = localStorage.getItem('accessToken')
    const response = await fetch(`${BASE_URL}/playlist`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    const { data } = await response.json()

    const playList = document.getElementById('playList')

    data?.playList?.items.forEach(function (playlist) {
      const listItem = document.createElement('li')
      listItem.textContent = playlist.name
      playList.appendChild(listItem)
    })
  } catch (error) {
    await validateToken()
  }
})
