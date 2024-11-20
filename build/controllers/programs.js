"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.programController = void 0;
const program_1 = __importDefault(require("../models/program"));
class programController {
    static Execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                program_1.default.find().then((programs) => {
                    res.status(200).send(programs);
                });
            }
            catch (error) {
                res.status(500).send({
                    message: "Error fetching programs",
                });
            }
        });
    }
}
exports.programController = programController;
