import {Fretboard, FretboardSystem, Position} from '@moonwave99/fretboard.js';
import {instruments} from "./tuning";
import {Mode, modes, modeToElement, notes, range, scaleTypes, scaleSystems} from "./config";
import {
    $chordSystemControl,
    $highlightTriads,
    $instrumentControl,
    $rootNoteControl,
    $scaleSystemControl,
    $scaleTypeControl
} from "./elements";
import {Chord, instrumentToChordSystem, renderChord} from "./chords";

require('./fretboard.scss');

let state = {
    root: notes[0],
    highlightTriads: false,
    instrument: instruments[0],
    tuning: instruments[0].tunings[0],
    mode: modes[0],
    scaleType: scaleTypes[0],
    scaleSystem: scaleSystems[0],
    chordType: null,
    fretboard: null,
    stringWidth: () => range(state.tuning.strings.length)
        .map((v, index) => index > 0 ? v * 0.5 : 0.5)
        .map((v) => v > 2 ? 2 : v)
}

const highlightMajorTriads = (fretboard: Fretboard) => {
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
}

interface RenderMode {
    configureFretboard: (fretboard: Fretboard) => void
    configureLayout: () => void
    onExit: () => void 
}

const chords: RenderMode = {
    configureFretboard(fretboard): void {
        if (state.chordType == null) {
            fretboard.render()
            return
        }

        const fretboardSystem = new FretboardSystem({
            tuning: state.tuning.strings,
            fretCount: 16
        })

        const chord: Position[] = renderChord(state.root, state.chordType as Chord, state.scaleType, fretboardSystem)

        fretboard.setDots(chord).render()

        if (!state.highlightTriads) {
            fretboard.style({
                text: ({note}) => note,
                fontSize: 10,
                fill: (state.chordType as Chord).color
            })
            return;
        }

        highlightMajorTriads(fretboard)
    },
    configureLayout(): void {
        $chordSystemControl.classList.remove("is-hidden")

        const chordSystem = instrumentToChordSystem.get(state.instrument)

        if (chordSystem == null) {
            $chordSystemControl.innerHTML = ""
            return
        }

        $chordSystemControl.innerHTML = chordSystem.chords
            .map(chord => {
                const chordName: string = chord.root.toUpperCase()
                const selectedChord = state.chordType != null && chord === state.chordType
                return `
                <p class="control">
                   <button id="${chordName}" class="chord button is-small is-outlined is-primary ${selectedChord ? 'is-focused' : ''}">${chordName}</button>
                </p>
                `
            })
            .join("")

        const $chordSystemButtons = Array.from($chordSystemControl.getElementsByClassName("chord"))
            .filter(button => button != null) as Element[]

        for (let $chordButton of $chordSystemButtons) {
            $chordButton.addEventListener("click", _ => {
                let chord = chordSystem.chords.find(chord => chord.root == $chordButton.id)
                $chordSystemButtons.forEach(button => {
                    button.classList.remove('is-active')
                    button.classList.remove('is-focused')
                })
                $chordButton.classList.add('is-active')
                $chordButton.classList.add('is-focused')
                updateFretboard({chordType: chord})
            })
        }
    },
    onExit(): void {
        $chordSystemControl.classList.add("is-hidden")
    }
}

const scales: RenderMode = {
    configureFretboard(fretboard: Fretboard): void {
        fretboard.renderScale({
            root: state.root,
            type: state.scaleType.toLowerCase() + (state.scaleSystem != "Default" ? " " + state.scaleSystem.toLowerCase() : ""),
        }).style({
            fontSize: 10
        })

        if (!state.highlightTriads) {
            fretboard.style({
                text: ({note}) => note,
            })
            return
        }

        highlightMajorTriads(fretboard)
    },
    configureLayout(): void {
        $scaleSystemControl.classList.remove("is-hidden")

        $scaleSystemControl.innerHTML = scaleSystems
        .map(system => {
            const selectedSystem = state.scaleSystem != null && system === state.scaleSystem
            return `
            <p class="control">
               <button id="${system}" class="scale-system button is-small is-outlined is-link ${selectedSystem ? 'is-focused' : ''}">${system}</button>
            </p>
            `
        })
        .join("")

    const $scaleSystemButtons = Array.from($scaleSystemControl.getElementsByClassName("scale-system"))
        .filter(button => button != null) as HTMLInputElement[]

    for (let $systemButton of $scaleSystemButtons) {
        const tokens = ['is-active', 'is-focused']
        $systemButton.addEventListener("click", _ => {
            $scaleSystemButtons.forEach(button => {
                button.classList.remove(...tokens)
            })
            $systemButton.classList.add(...tokens)
            updateFretboard({scaleSystem: $systemButton.innerText})
        })
    }
    },
    onExit(): void {
        $scaleSystemControl.classList.add("is-hidden")
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

    const currentMode = renderMode(state.mode)
    currentMode?.onExit()

    state = {
        ...state,
        ...newState
    }

    for (const mode of modes) {
        const modeElement = modeToElement.get(mode)
        modeElement.classList.remove(focused)
        modeElement.classList.remove(active)
    }

    (modeToElement.get("chords") as HTMLInputElement).disabled = instrumentToChordSystem.get(state.instrument) == null

    if (state.mode == 'chords' && instrumentToChordSystem.get(state.instrument) == null) {
        state.mode = 'scales'
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
        updateMode({chordType: null, instrument: selectedInstrument})
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
