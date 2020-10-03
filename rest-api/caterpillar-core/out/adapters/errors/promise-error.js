"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.PromiseError = void 0;
class PromiseError {
    constructor(source, errorMessage, components) {
        this.source = source;
        this.errorMessage = errorMessage;
        this.components = components;
    }
}
exports.PromiseError = PromiseError;
class Component {
    constructor(components, functions) {
        this.components = components;
        this.functions = functions;
    }
}
exports.Component = Component;
//# sourceMappingURL=promise-error.js.map