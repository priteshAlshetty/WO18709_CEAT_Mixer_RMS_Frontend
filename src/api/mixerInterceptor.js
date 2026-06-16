
import axiosInstance from './axios'

let currentMixer = 'Mixer1'

export const setCurrentMixer = (mixer) => {
  currentMixer = mixer
}

axiosInstance.interceptors.request.use(
  (config) => {
    // Add mixer header
    config.headers['x-mixer-id'] = currentMixer

    // Add JWT token
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)