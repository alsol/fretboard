export const range = n => Array.from({length: n}, (value, key) => key)

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].filter(note => !note.endsWith("#"))
export const scaleTypes = ['Major', 'Minor']
export const modes = ['scales', 'chords']

export const modeToElement = new Map<string, Element>(modes.map(mode => [mode, document.getElementById(mode + "-switch")]));
