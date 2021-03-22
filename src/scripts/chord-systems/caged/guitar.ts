import {guitar} from "../../tuning";
import {Chord, ChordSystem} from "../../chords";

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

export const Guitar: ChordSystem = {
    chords: [C, A, G, E, D],
    instrument: guitar
}