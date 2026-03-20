"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const piscina_1 = require("piscina");
exports.default = () => new piscina_1.Piscina({
    filename: path_1.default.resolve(__dirname + '/loaders/index.js'),
    idleTimeout: 30000,
    recordTiming: false,
});
