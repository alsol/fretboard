import {Fretboard} from '@moonwave99/fretboard.js';
import {instruments} from "./tuning";
import {Mode, modes, modeToElement, notes, range, scaleTypes} from "./config";
import {$highlightTriads, $instrumentControl, $rootNoteControl, $scaleTypeControl} from "./elements";

require('./fretboard.scss');

let state = {
    root: notes[0],
    highlightTriads: false,
    instrument: instruments[0],
    tuning: instruments[0].tunings[0],
    mode: modes[0],
    scaleType: scaleTypes[0],
    fretboard: null,
    stringWidth: () => range(state.tuning.strings.length)
        .map((v, index) => index > 0 ? v * 0.5 : 0.5)
        .map((v) => v > 2 ? 2 : v)
}

interface RenderMode {
    configureFretboard: (fretboard: Fretboard) => void
    configureLayout: () => void
}

const chords: RenderMode = {
    configureFretboard(fretboard): void {
        fretboard.render()
    },
    configureLayout(): void {
        $highlightTriads.classList.add("is-hidden")
    }
}

const scales: RenderMode = {
    configureFretboard(fretboard: Fretboard): void {
        fretboard.renderScale({
            root: state.root,
            type: state.scaleType.toLowerCase(),
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
            text: ({interval}) => interval,
            fill: '#e76f51'
        }).style({
            filter: {interval: '3' + (state.scaleType == 'Major' ? 'M' : 'm')},
            text: ({interval}) => interval,
            fill: "#F29727"
        }).style({
            filter: {interval: "5P"},
            text: ({interval}) => interval,
            fill: '#D89D6A',
        }).style({
            filter: ({interval}) => !majorTriads.has(interval),
            opacity: 0.5
        })
    },
    configureLayout(): void {
        $highlightTriads.classList.remove("is-hidden")
    }
}

const renderMode = (mode: Mode): RenderMode | null => {
    switch (mode) {
        case "chords":
            return chords
        case "scales":
            return scales
        default:
            return null
    }
}

function updateMode(newState) {
    const focused = 'is-focused'
    const active = 'is-active'

    state = {
        ...state,
        ...newState
    }

    for (const mode of modes) {
        const modeElement = modeToElement.get(mode)
        modeElement.classList.remove(focused)
        modeElement.classList.remove(active)
    }

    const selectedElement = modeToElement.get(state.mode)
    selectedElement.classList.add(focused)
    selectedElement.classList.add(active)

    renderMode(state.mode)?.configureLayout()
    updateFretboard({})
}

function updateTuningControl(newState) {
    state = {
        ...state,
        ...newState
    }

    let $tuningControl = document.getElementById("tuning-select")

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

    state.fretboard = new Fretboard({
        el: '#fretboard',
        dotFill: 'white',
        fretCount: 16,
        tuning: state.tuning.strings,
        stringCount: state.tuning.strings.length,
        font: 'Nunito',
        middleFretColor: '#666',
        stringWidth: state.stringWidth()
    });

    renderMode(state.mode)?.configureFretboard(state.fretboard)
}

const start = () => {

    modeToElement.forEach((value: Element, key: string) => {
        value.addEventListener('click', _ => {
            updateMode({mode: key})
        })
    })

    $highlightTriads.addEventListener('change', (ev) => {
        updateFretboard({highlightTriads: (ev.target as HTMLInputElement).checked})
    })

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

    $scaleTypeControl.innerHTML = scaleTypes
        .map((type) => {
            return `
        <option value='${type}' ${type == state.scaleType ? 'selected' : ''}>${type}</option>
        `
        })
        .join('')

    $scaleTypeControl.addEventListener('change', (ev) => {
        updateFretboard({scaleType: (ev.target as HTMLTextAreaElement).value})
    })

    updateMode({})
    updateTuningControl({})
}

start()
