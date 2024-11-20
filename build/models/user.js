"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const User = mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true,
    },
    email: {
        type: String,
        default: "",
        required: true,
    },
    password: {
        type: String,
        default: "",
        required: true,
    },
    reference: {
        type: String,
        default: "",
        required: true,
    },
    program: {
        type: String,
        default: "",
        required: true,
    },
    role: {
        type: String,
        default: "",
        required: true,
    },
    dashboardUsername: {
        type: String,
        default: "",
        required: false,
    },
    dashboardPassword: {
        type: String,
        default: "",
        required: false,
    },
    amountPaid: {
        type: Number,
        default: 0,
        required: false,
    },
}, { timestamps: true });
exports.default = mongoose.model("User", User);
