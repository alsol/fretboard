import {GUITAR_TUNINGS} from '@moonwave99/fretboard.js';

export interface Tuning {
    title: string,
    strings: string[]
}

export interface Instrument {
    title: string,
    tunings: Tuning[]
}

const bass: Instrument = {
    title: "Bass",
    tunings: [
        {title: 'standard', strings: ['E1', 'A1', 'D2', 'G2']}
    ]
}

export const uke: Instrument = {
    title: 'Ukulele',
    tunings: [
        {title: 'standard', strings: ['G4','C4','E4','A4']}
    ]
}

export const guitar: Instrument = {
    title: "Guitar",
    tunings: [
        {title: 'standard', strings: GUITAR_TUNINGS.default},
        {title: 'drop D', strings: GUITAR_TUNINGS.dropD},
        {title: 'drop C', strings: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4']}
    ]
}

const guitar7: Instrument = {
    title: "Guitar 7s",
    tunings: [
        {title: 'standard', strings: ['B2', ...GUITAR_TUNINGS.default]},
        {title: 'drop A', strings: ['A2', ...GUITAR_TUNINGS.default]},
    ]
}

export const instruments: Instrument[] = [
    guitar, guitar7, bass, uke
]