"use strict";
// THIS FILE IS AUTOMATICALLY GENERATED. TO UPDATE THIS FILE YOU NEED TO CHANGE THE
// CORRESPONDING JSON SCHEMA FILE, THEN RUN devkit-admin build (or bazel build ...).
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEncapsulation = exports.Style = exports.ChangeDetection = void 0;
/**
 * The change detection strategy to use in the new component.
 */
var ChangeDetection;
(function (ChangeDetection) {
    ChangeDetection["Default"] = "Default";
    ChangeDetection["OnPush"] = "OnPush";
})(ChangeDetection = exports.ChangeDetection || (exports.ChangeDetection = {}));
/**
 * The file extension or preprocessor to use for style files.
 */
var Style;
(function (Style) {
    Style["Css"] = "css";
    Style["Less"] = "less";
    Style["Sass"] = "sass";
    Style["Scss"] = "scss";
    Style["Styl"] = "styl";
})(Style = exports.Style || (exports.Style = {}));
/**
 * The view encapsulation strategy to use in the new component.
 */
var ViewEncapsulation;
(function (ViewEncapsulation) {
    ViewEncapsulation["Emulated"] = "Emulated";
    ViewEncapsulation["None"] = "None";
    ViewEncapsulation["ShadowDom"] = "ShadowDom";
})(ViewEncapsulation = exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
