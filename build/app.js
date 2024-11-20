"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const useragent = require("express-useragent");
app.use(useragent.express());
dotenv.config();
app.use(cors({
    // Allow requests from all origins (or specify allowed origins)
    origin: "*",
    // Allow the following headers to be sent in the request
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    // Allow the following headers to be exposed to the client
    exposedHeaders: ["x-auth-token"],
}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(require("./routes/login"));
app.use(require("./routes/signup"));
app.use(require("./routes/credentials"));
app.use(require("./routes/payment"));
app.use(require("./routes/clinics"));
app.use(require("./routes/patients"));
app.use(require("./routes/programs"));
app.use(require("./routes/resetPassword"));
exports.default = app;
