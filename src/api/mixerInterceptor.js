import axiosInstance from './axios'

let currentMixer = 'Mixer 1'

export const setCurrentMixer = (mixer) => {
  currentMixer = mixer
}

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['x-mixer-id'] = currentMixer
    return config
  },
  (error) => Promise.reject(error)
)
