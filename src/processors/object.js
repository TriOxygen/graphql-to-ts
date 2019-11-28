"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var typeLookup = {
    String: 'string',
    Boolean: 'boolean',
    Int: 'number',
    Float: 'number',
    DateTime: 'number'
};
var fieldProcessors = [
    {
        match: function (field) { return /sys/.test(field.name); },
        process: function (field, indent) {
            if (indent === void 0) { indent = ''; }
            return indent + "sys: Sys;";
        }
    },
    {
        match: function (field) { return /Collection$/.test(field.name); },
        process: function (field, indent) {
            if (indent === void 0) { indent = ''; }
            return indent + "sys: Collection<" + field.type.name.replace('Collection', '') + ">;";
        }
    },
];
var blacklistedFields = {
    linkedFrom: true
};
var processField = function (field, indent) {
    if (indent === void 0) { indent = ''; }
    // if (!field.type.name) {
    //   console.log(field);
    // }
    var foundProcessor = fieldProcessors.find(function (subProcessor) {
        return subProcessor.match(field);
    });
    if (foundProcessor) {
        return foundProcessor.process(field, indent);
    }
    if (field.type.kind === 'LIST') {
        return "" + indent + field.name + ": " + (typeLookup[field.type.ofType.name] || field.type.ofType.name) + "[];";
    }
    return "" + indent + field.name + ": " + (typeLookup[field.type.name] || field.type.name) + ";";
};
var objectProcessor = function (objectData, indent) {
    if (indent === void 0) { indent = ''; }
    // console.log(objectData.fields);
    return __spreadArrays([
        "interface " + objectData.name + " {"
    ], objectData.fields
        .filter(function (field) { return !blacklistedFields[field.name]; })
        .map(function (field) { return processField(field, indent + '  '); }), [
        '}',
    ]).join('\n');
};
exports["default"] = objectProcessor;
