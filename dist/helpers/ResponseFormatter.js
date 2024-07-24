"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseFormatter {
    static success(res, data = null, message = 'Success', code = 200) {
        return res.status(code).json({
            meta: {
                code,
                status: 'success',
                message,
            },
            data,
        });
    }
    static error(res, data = null, message = 'Error', code = 400) {
        return res.status(code).json({
            meta: {
                code,
                status: 'error',
                message,
            },
            data,
        });
    }
}
exports.default = ResponseFormatter;
