import { createContext } from 'react'

export const MixerContext = createContext({
  selectedMixer: 'Mixer 1',
  setSelectedMixer: () => {}
})
