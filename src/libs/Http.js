import axios from 'axios'

export const getRequest = async (url, headers) => {
  try {
    const response = await axios.get(url, {
      headers
    })
    return {
      status: response.status,
      data: response.data
    }
  } catch (error) {
    return {
      status: error?.response?.status
    }
  }
}

export const postRequest = async (url, data, headers = {}) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        ...headers
      }
    })

    return {
      status: response.status,
      data: response.data
    }
  } catch (error) {
    throw error
  }
}
