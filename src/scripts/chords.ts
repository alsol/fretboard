import {FretboardSystem, Position} from "@moonwave99/fretboard.js";
import {guitar, Instrument} from "./tuning";


export interface Chord {
    root: string,
    pattern: string,
    instrument?: Instrument
}

export type ChordSystem = Chord[]

const C: Chord = {
    root: 'C',
    pattern: 'xR35R3',
    instrument: guitar
}

const A: Chord = {
    root: 'A',
    pattern: 'xR5R35',
    instrument: guitar
}

const G: Chord = {
    root: 'G',
    pattern: 'xx5R5R',
    instrument: guitar
}

const E: Chord = {
    root: 'E',
    pattern: 'R5R35R',
    instrument: guitar
}

const D: Chord = {
    root: 'D',
    pattern: 'xxR5R3',
    instrument: guitar
}

export const CAGED: ChordSystem = [C, A, G, E, D]

export function renderChord(chord: Chord, system: FretboardSystem): string {
    const rootScale: Position[] = system.getScale({root: chord.root, type: 'major'})

    return chord.pattern.split('')
        .map((value, index) => {
            if (value === 'x') {
                return value
            }

            const interval = value === 'R' ? '1' : value

            return rootScale.filter(position => position.string == index)
                .find(position => position.interval.startsWith(interval))?.fret ?? 'x'
        }).join('')
}


