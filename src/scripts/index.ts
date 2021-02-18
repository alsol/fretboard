import {Fretboard, GUITAR_TUNINGS} from '@moonwave99/fretboard.js';

require('./fretboard.scss');

const range = n => Array.from({length: n}, (value, key) => key)

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const modes = ['Major', 'Minor']

let state = {
    root: notes[0],
    tuning: GUITAR_TUNINGS.default,
    mode: modes[0],
    stringWidth: () => range(state.tuning.length)
        .map((v, index) => index > 0 ? v * 0.5 : 0.5)
        .map((v) => v > 2 ? 2 : v)
}

const $wrapper = document.getElementById('scales')
$wrapper.querySelector(".tuning").innerHTML = state.tuning
    .map((note) => {
        return `
        <span class="column">${note}</span> 
        `
    })
    .join('')


const fretboard = new Fretboard({
    el: '#fretboard',
    dotFill: 'white',
    fretCount: 16,
    tuning: state.tuning,
    stringCount: state.tuning.length,
    font: 'Nunito',
    middleFretColor: '#666',
    stringWidth: state.stringWidth()
});


function updateFretboard(newState) {
    state = {
        ...state,
        ...newState
    }

    fretboard.renderScale({
        root: state.root,
        type: state.mode.toLowerCase(),
    }).style({
        text: ({note}) => note,
        fontSize: 10
    }).style({
        filter: {interval: '1P'},
        fill: '#e76f51'
    }).style({
        filter: {interval: '3' + (state.mode == 'Major' ? 'M' : 'm')},
        fill: "#F29727"
    }).style({
        filter: {interval: "5P"},
        fill: '#D89D6A'
    })
}

const $rootNoteControl = document.getElementById("root-note")
const $modeControl = document.getElementById("mode")

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

updateFretboard({})

