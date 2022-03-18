export const range = (n: number) => Array.from({length: n}, (value, key) => key)

export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].filter(note => !note.endsWith("#"))
export const scaleTypes = ['Major', 'Minor']
export const scaleSystems: Array<System> = ["Default", "Pentatonic"]

export type System = "Default" | "Pentatonic"

export type Scales = "scales"
export type Chords = "chords"

export type Mode = Scales | Chords

export const modes: Array<Mode> = ["scales", "chords"]

export const modeToElement = new Map<string, Element>(modes.map(mode => [mode, document.getElementById(mode + "-switch")]));