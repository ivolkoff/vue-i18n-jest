"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const debug_1 = require("debug");
const json5_1 = require("json5");
const js_yaml_1 = require("js-yaml");
const debug = (0, debug_1.debug)('vue-i18n-jest');
const VUE_I18N_OPTION = '__i18n';
/**
 * Process vue-i18n contents inside of a custom block and prepare it for execution in a testing environment.
 */
function process({ blocks, componentNamespace, filename }) {
    const i18nResources = blocks.map(block => {
        if (block.type !== 'i18n')
            return;
        const value = parseI18nBlockToJSON(block, filename)
            .replace(/\u2028/g, '\\u2028') // LINE SEPARATOR
            .replace(/\u2029/g, '\\u2029'); // PARAGRAPH SEPARATOR
        // .replace(/\\/g, '\\\\')
        // .replace(/'/g, "\\'")
        const valueJson = JSON.parse(value);
        return Object.entries(valueJson).map(([key, value]) => `{"locale": "${key}", "resource": ${JSON.stringify(value)}}`);
    }).filter((s) => !!s?.length);
    // vueOptions.__i18n = [
    // '<json encoded block 1>',
    // '<json encoded block 2>'
    // ]
    const i18nOption = `${componentNamespace}.${VUE_I18N_OPTION}`;
    const code = i18nResources.length ? `${i18nOption} = [\n${i18nResources.join(',\n')}\n]` : '';
    debug('generatedCode', code);
    return [code];
}
exports.default = process;
/**
 * Parse custom `<i18n>` block content to JSON string.
 * @param block SFC block returned from `@vue/component-compiler-utils`
 * @param filename The SFC file being processed
 */
function parseI18nBlockToJSON(block, filename) {
    const lang = block.attrs && block.attrs.lang;
    const locale = block.attrs && block.attrs.locale;
    const src = block.attrs && block.attrs.src;
    const content = src
        ? (0, fs_1.readFileSync)(getAbsolutePath(src, filename)).toString()
        : block.content;
    return convertToJSON(content, lang, locale);
}
/**
 * Convert JSON/YAML/JSON5 to minified JSON string.
 * @param source JSON/YAML/JSON5 encoded string
 * @param lang Language used in `source`. Supported JSON, YAML or JSON5.
 * @param locale Attribute "locale" on <i18n> block will be added.
 * @returns {string} A minified JSON string
 */
function convertToJSON(source, lang, locale) {
    const stringify = locale
        ? (parseResult) => JSON.stringify({ [locale]: parseResult })
        : JSON.stringify;
    switch (lang) {
        case 'yaml':
        case 'yml':
            return stringify((0, js_yaml_1.safeLoad)(source));
        case 'json5':
            return stringify((0, json5_1.parse)(source));
        default: // fallback to 'json'
            return stringify(JSON.parse(source));
    }
}
function getAbsolutePath(src, fileName) {
    return (0, path_1.isAbsolute)(src) ? src : (0, path_1.resolve)(fileName, '../', src);
}
