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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, 'your-secret-key', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            try {
                const userRepository = (0, typeorm_1.getRepository)(User_1.User);
                const user = yield userRepository.findOne({ where: { id: decoded.id } });
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(401).json({ message: 'User not found' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Something went wrong' });
            }
        }));
    }
    else {
        res.status(401).json({ message: 'No token provided' });
    }
});
exports.authenticate = authenticate;
