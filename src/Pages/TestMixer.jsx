import { useEffect, useContext } from 'react'
import api from '../api/axios'
import { MixerContext } from '../context/MixerContext'

const TestMixer = () => {
  const { selectedMixer } = useContext(MixerContext)

  useEffect(() => {
    console.log('Selected Mixer:', selectedMixer)

    // API call using Axios instance
    api.get('/recipes')  // replace '/recipes' with a real endpoint
      .then(res => {
        console.log('API Response:', res.data)
      })
      .catch(err => {
        console.error('API Error:', err)
      })
  }, [selectedMixer])

  return (
    <div>
      <h2>Test Mixer Page</h2>
      <p>Current Mixer: {selectedMixer}</p>
      <p>Check the console and network tab for the request and header.</p>
    </div>
  )
}

export default TestMixer
