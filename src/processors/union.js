"use strict";
exports.__esModule = true;
var unionProcesor = function (unionData) {
    return "type " + unionData.name + " = " + unionData.possibleTypes.map(function (unionValue) { return unionValue.name; }).join(' | ') + ";";
};
exports["default"] = unionProcesor;
