"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fretboard_js_1 = require("@moonwave99/fretboard.js");
require('./fretboard.scss');
var range = function (n) { return Array.from({ length: n }, function (value, key) { return key; }); };
var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var modes = ['Major', 'Minor'];
var state = {
    root: notes[0],
    tuning: fretboard_js_1.GUITAR_TUNINGS.default,
    mode: modes[0],
    stringWidth: function () { return range(state.tuning.length)
        .map(function (v, index) { return index > 0 ? v * 0.5 : 0.5; })
        .map(function (v) { return v > 2 ? 2 : v; }); }
};
var $wrapper = document.getElementById('scales');
$wrapper.querySelector(".tuning").innerHTML = state.tuning
    .map(function (note) {
    return "\n        <span class=\"column\">" + note + "</span> \n        ";
})
    .join('');
var fretboard = new fretboard_js_1.Fretboard({
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
    state = __assign(__assign({}, state), newState);
    fretboard.renderScale({
        root: state.root,
        type: state.mode.toLowerCase(),
    }).style({
        text: function (_a) {
            var note = _a.note;
            return note;
        },
        fontSize: 10
    }).style({
        filter: { interval: '1P' },
        fill: '#e76f51'
    }).style({
        filter: { interval: '3' + (state.mode == 'Major' ? 'M' : 'm') },
        fill: "#F29727"
    }).style({
        filter: { interval: "5P" },
        fill: '#D89D6A'
    });
}
var $rootNoteControl = document.getElementById("root-note");
var $modeControl = document.getElementById("mode");
$rootNoteControl.innerHTML = notes
    .map(function (note) {
    return "\n        <option value='" + note + "' " + (note == state.root ? 'selected' : '') + ">" + note + "</option>\n        ";
})
    .join('');
$rootNoteControl.addEventListener('change', function (ev) {
    updateFretboard({ root: ev.target.value });
});
$modeControl.innerHTML = modes
    .map(function (mode) {
    return "\n        <option value='" + mode + "' " + (mode == state.mode ? 'selected' : '') + ">" + mode + "</option>\n        ";
})
    .join('');
$modeControl.addEventListener('change', function (ev) {
    updateFretboard({ mode: ev.target.value });
});
updateFretboard({});
//# sourceMappingURL=index.js.map