import {FretboardSystem, Position} from "@moonwave99/fretboard.js";
import {guitar, Instrument} from "./tuning";


export interface Chord {
    root: string,
    pattern: string,
    color: string
}

export type ChordSystem = {
    chords: Chord[],
    instrument?: Instrument
}

const C: Chord = {
    root: 'C',
    pattern: 'xR35R3',
    color: 'info'
}

const A: Chord = {
    root: 'A',
    pattern: 'xR5R35',
    color: 'success'
}

const G: Chord = {
    root: 'G',
    pattern: 'xx5R5R',
    color: 'danger'
}

const E: Chord = {
    root: 'E',
    pattern: 'R5R35R',
    color: 'warning'
}

const D: Chord = {
    root: 'D',
    pattern: 'xxR5R3',
    color: 'primary'
}

const CAGED: ChordSystem = {
    chords: [C, A, G, E, D],
    instrument: guitar
}

export const instrumentToChordSystem = new Map<Instrument, ChordSystem>(
    [CAGED].map(chordSystem => [chordSystem.instrument, chordSystem])
)

export function renderChord(root: string, chord: Chord, system: FretboardSystem): string {
    const rootScale: Position[] = system.getScale({root: chord.root, type: 'major'})
    const maxStrings = Math.max(...rootScale.map(position => position.string))

    return chord.pattern.split('')
        .map((value, index) => {
            if (value == 'x') {
                return value
            }

            const interval = value == 'R' ? '1' : value

            return rootScale.filter(position => position.string == (maxStrings - index))
                .find(position => position.interval.startsWith(interval))?.fret ?? 'x'
        }).join('')
}


