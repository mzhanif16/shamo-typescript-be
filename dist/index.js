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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const ormconfig_1 = __importDefault(require("./ormconfig"));
const UserController_1 = require("./controllers/UserController");
const authMiddleware_1 = require("./middleware/authMiddleware");
(0, typeorm_1.createConnection)(ormconfig_1.default).then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/register', UserController_1.UserController.register);
    app.post('/login', UserController_1.UserController.login);
    app.get('/fetch', authMiddleware_1.authenticate, UserController_1.UserController.fetch);
    app.put('/profile', authMiddleware_1.authenticate, UserController_1.UserController.updateProfile);
    app.post('/logout', authMiddleware_1.authenticate, UserController_1.UserController.logout);
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})).catch(error => console.log(error));
