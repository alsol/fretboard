import {uke} from "../../tuning";
import {Chord, ChordSystem} from "../../chords";

const C: Chord = {
    root: "C",
    pattern: "5R3R",
    color: "#e76f51"
}

const A: Chord = {
    root: "A",
    pattern: "R35R",
    color: "#6a994e"
}

const G: Chord = {
    root: "G",
    pattern: "R5R3",
    color: "#8338ec"
}

const F: Chord = {
    root: "F",
    pattern: "35R3",
    color: "#ffbd00"
}

const D: Chord = {
    root: "D",
    pattern: "5R35",
    color: "#00bbf9"
}

export const ukulele: ChordSystem = {
    instrument: uke,
    chords: [C, A, G, F, D]
}