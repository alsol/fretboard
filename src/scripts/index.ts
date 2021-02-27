import {Fretboard} from '@moonwave99/fretboard.js';
import {instruments} from "./tuning";

require('./fretboard.scss');

const range = n => Array.from({length: n}, (value, key) => key)

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].filter(note => !note.endsWith("#"))
const modes = ['Major', 'Minor']

let state = {
    root: notes[0],
    highlightTriads: false,
    instrument: instruments[0],
    tuning: instruments[0].tunings[0],
    mode: modes[0],
    stringWidth: () => range(state.tuning.strings.length)
        .map((v, index) => index > 0 ? v * 0.5 : 0.5)
        .map((v) => v > 2 ? 2 : v)
}

let fretboard: Fretboard

let $tuningControl = document.getElementById("tuning-select")

function updateTuningControl(newState) {
    state = {
        ...state,
        ...newState
    }

    const $clone = $tuningControl.cloneNode(true)
    $tuningControl.parentNode.replaceChild($clone, $tuningControl)
    $tuningControl = ($clone as HTMLInputElement)

    $tuningControl.innerHTML = state.instrument.tunings
        .map((tuning) => {
            const title = tuning.title
            return `
            <option value="${title}" ${tuning === state.tuning ? 'selected' : ''}>${title}</option>
            `
        })
        .join('');

    ($tuningControl as HTMLInputElement).disabled = state.instrument.tunings.length == 1

    $tuningControl.addEventListener('change', el => {
        const selectedItem = (el.target as HTMLInputElement).value;
        const selectedTuning = state.instrument.tunings.find(tuning => tuning.title === selectedItem)
        updateFretboard({tuning: selectedTuning})
    })

    updateFretboard({})
}

function updateFretboard(newState) {
    state = {
        ...state,
        ...newState
    }

    document.getElementById("fretboard").innerHTML = ''

    fretboard = new Fretboard({
        el: '#fretboard',
        dotFill: 'white',
        fretCount: 16,
        tuning: state.tuning.strings,
        stringCount: state.tuning.strings.length,
        font: 'Nunito',
        middleFretColor: '#666',
        stringWidth: state.stringWidth()
    });

    fretboard.renderScale({
        root: state.root,
        type: state.mode.toLowerCase(),
    }).style({
        fontSize: 10
    })

    if (!state.highlightTriads) {
        fretboard.style({
            text: ({note}) => note,
        })
        return
    }

    let majorTriads = new Set(['1P', '3M', '3m', '5P'])

    fretboard.style({
        filter: {interval: '1P'},
        text: () => '1P',
        fill: '#e76f51'
    }).style({
        filter: {interval: '3' + (state.mode == 'Major' ? 'M' : 'm')},
        text: () => '3' + (state.mode == 'Major' ? 'M' : 'm'),
        fill: "#F29727"
    }).style({
        filter: {interval: "5P"},
        text: () => '5P',
        fill: '#D89D6A',
    }).style({
        filter: ({interval}) => !majorTriads.has(interval),
        opacity: 0.5
    })
}

document.getElementById('highlight-triads').addEventListener('change', (ev) => {
    updateFretboard({highlightTriads: (ev.target as HTMLInputElement).checked})
})

const $instrumentControl = document.getElementById("instrument-select")
const $rootNoteControl = document.getElementById("root-note")
const $modeControl = document.getElementById("mode")

$instrumentControl.innerHTML = instruments
    .map((instrument) => {
        const title = instrument.title.toLowerCase()
        return `
        <option value="${title}" ${state.instrument === instrument ? 'selected' : ''}>${title}</option>
        `
    })
    .join('')

$instrumentControl.addEventListener('change', ev => {
    const selectedItem = (ev.target as HTMLInputElement).value
    const selectedInstrument = instruments.find(inst => inst.title.toLowerCase() === selectedItem)
    updateTuningControl({instrument: selectedInstrument, tuning: selectedInstrument.tunings[0]})
})

$rootNoteControl.innerHTML = notes
    .map((note) => {
        return `
        <option value='${note}' ${note == state.root ? 'selected' : ''}>${note}</option>
        `
    })
    .join('')

$rootNoteControl.addEventListener('change', (ev) => {
    updateFretboard({root: (ev.target as HTMLTextAreaElement).value})
})

$modeControl.innerHTML = modes
    .map((mode) => {
        return `
        <option value='${mode}' ${mode == state.mode ? 'selected' : ''}>${mode}</option>
        `
    })
    .join('')

$modeControl.addEventListener('change', (ev) => {
    updateFretboard({mode: (ev.target as HTMLTextAreaElement).value})
})

updateTuningControl({})
