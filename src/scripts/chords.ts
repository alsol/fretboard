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
    color: '#e76f51'
}

const A: Chord = {
    root: 'A',
    pattern: 'xR5R35',
    color: '#6a994e'
}

const G: Chord = {
    root: 'G',
    pattern: 'xx5R5R',
    color: '#8338ec'
}

const E: Chord = {
    root: 'E',
    pattern: 'R5R35R',
    color: '#ffbd00'
}

const D: Chord = {
    root: 'D',
    pattern: 'xxR5R3',
    color: '#00bbf9'
}

const CAGED: ChordSystem = {
    chords: [C, A, G, E, D],
    instrument: guitar
}

export const instrumentToChordSystem = new Map<Instrument, ChordSystem>(
    [CAGED].map(chordSystem => [chordSystem.instrument, chordSystem])
)

export function renderChord(root: string, chord: Chord, type: string, system: FretboardSystem): string[] {
    const rootScale: Position[] = system.getScale({root: root, type: 'major'})
    const maxStrings = Math.max(...rootScale.map(position => position.string))

    const chordPattern = chord.pattern.split('')

    const currentStringFilter = (index) => (position: Position) => position.string == (maxStrings - index)

    const highestRoot: number = Math.max(...chordPattern.map((value, index) => {
        if (value != 'R') {
            return -1
        }

        return rootScale.filter(currentStringFilter(index))
            .filter(position => root == chord.root || position.fret > 0)
            .find(position => position.interval.startsWith('1P'))?.fret ?? -1
    }).filter(fret => fret > 0))

    return chordPattern
        .map((value, index) => {
            if (value == 'x') {
                return value
            }

            const interval = value == 'R' ? '1' : value

            return rootScale.filter(currentStringFilter(index))
                .filter(position => position.fret > highestRoot - 4)
                .find(position => position.interval.startsWith(interval))?.fret ?? 'x'
        }).map(fret => fret as string)
}


