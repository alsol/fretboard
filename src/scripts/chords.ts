import {FretboardSystem, Position} from "@moonwave99/fretboard.js";
import {guitar, Instrument} from "./tuning";


export interface Chord {
    root: string,
    pattern: string
}

export type ChordSystem = {
    chords: Chord[],
    instrument?: Instrument
}

const C: Chord = {
    root: 'C',
    pattern: 'xR35R3',
}

const A: Chord = {
    root: 'A',
    pattern: 'xR5R35',
}

const G: Chord = {
    root: 'G',
    pattern: 'xx5R5R',
}

const E: Chord = {
    root: 'E',
    pattern: 'R5R35R',
}

const D: Chord = {
    root: 'D',
    pattern: 'xxR5R3',
}

export const CAGED: ChordSystem = {
    chords: [C, A, G, E, D],
    instrument: guitar
}

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


