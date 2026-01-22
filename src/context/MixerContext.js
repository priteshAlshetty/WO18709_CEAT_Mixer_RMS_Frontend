import { createContext } from 'react'

export const MixerContext = createContext({
  selectedMixer: 'Mixer1',
  setSelectedMixer: () => {}
})
