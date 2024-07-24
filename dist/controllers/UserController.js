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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const typeorm_1 = require("typeorm");
const ResponseFormatter_1 = __importDefault(require("../helpers/ResponseFormatter"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const User_1 = require("../entity/User");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, express_validator_1.body)('name').isString().isLength({ max: 255 }).run(req);
        yield (0, express_validator_1.body)('username').isString().isLength({ max: 255 }).run(req);
        yield (0, express_validator_1.body)('email').isEmail().isLength({ max: 255 }).run(req);
        yield (0, express_validator_1.body)('phone').optional().isString().isLength({ max: 255 }).run(req);
        yield (0, express_validator_1.body)('password').isString().isLength({ min: 8 }).run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter_1.default.error(res, null, 'Validation failed', 400);
        }
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const { name, username, email, phone, password } = req.body;
        const user = new User_1.User();
        user.name = name;
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.password = yield bcrypt_1.default.hash(password, 10);
        yield userRepository.save(user);
        const token = user.createToken();
        return ResponseFormatter_1.default.success(res, {
            access_token: token,
            token_type: 'Bearer',
            user
        }, 'User Registered', 201);
    }
    catch (error) {
        return ResponseFormatter_1.default.error(res, error, 'Something went wrong', 500);
    }
});
UserController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, express_validator_1.body)('email').isEmail().run(req);
        yield (0, express_validator_1.body)('password').isString().run(req);
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return ResponseFormatter_1.default.error(res, null, 'Validation failed', 400);
        }
        const { email, password } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return ResponseFormatter_1.default.error(res, null, 'Unauthorized', 401);
        }
        const token = user.createToken();
        return ResponseFormatter_1.default.success(res, {
            access_token: token,
            token_type: 'Bearer',
            user
        }, 'Login Successful');
    }
    catch (error) {
        return ResponseFormatter_1.default.error(res, error, 'Something went wrong', 500);
    }
});
UserController.fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return ResponseFormatter_1.default.success(res, req.user, 'Data profile user berhasil diambil');
});
UserController.updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const user = yield userRepository.findOne({
            where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }
        });
        if (!user) {
            return ResponseFormatter_1.default.error(res, null, 'User not found', 404);
        }
        userRepository.merge(user, req.body);
        yield userRepository.save(user);
        return ResponseFormatter_1.default.success(res, user, 'Profile Updated');
    }
    catch (error) {
        return ResponseFormatter_1.default.error(res, error, 'Something went wrong', 500);
    }
});
UserController.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // User information should be attached to the request by the authMiddleware
        const user = req.user;
        if (!user) {
            return ResponseFormatter_1.default.error(res, null, 'User not found', 404);
        }
        return ResponseFormatter_1.default.success(res, { user }, 'User Retrieved');
    }
    catch (error) {
        return ResponseFormatter_1.default.error(res, error, 'Something went wrong', 500);
    }
});
UserController.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Implement logout functionality (e.g., invalidate JWT tokens)
    return ResponseFormatter_1.default.success(res, null, 'Token Revoked');
});
