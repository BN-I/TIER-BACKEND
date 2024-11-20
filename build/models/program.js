"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Program = mongoose.Schema({
    title: {
        type: String,
        default: "",
        required: true,
    },
    value: {
        type: String,
        default: "",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose.model("Program", Program);
