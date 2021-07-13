import {FretboardSystem, Position} from "@moonwave99/fretboard.js";
import {Guitar} from "./chord-systems/caged/guitar"
import {Instrument} from "./tuning";
import {ukulele} from "./chord-systems/caged/ukulele";


export interface Chord {
    root: string,
    pattern: string,
    color: string
}

export type ChordSystem = {
    chords: Chord[],
    instrument?: Instrument
}

export const instrumentToChordSystem = new Map<Instrument, ChordSystem>(
    [Guitar, ukulele].map(chordSystem => [chordSystem.instrument, chordSystem])
)

export function renderChord(root: string, chord: Chord, type: string, system: FretboardSystem): Position[] {
    const rootScale: Position[] = system.getScale({root: root, type: type.toLowerCase()})
    const maxStrings = Math.max(...rootScale.map(position => position.string))

    const chordPattern = chord.pattern.split('')

    const currentStringFilter = (index: number) => (position: Position) => position.string == (maxStrings - index)

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
                return null
            }

            const interval = value == 'R' ? '1' : value

            return rootScale.filter(currentStringFilter(index))
                .filter(position => position.fret > highestRoot - 4)
                .find(position => position.interval.startsWith(interval))
        }).filter(position => position != null)
}


