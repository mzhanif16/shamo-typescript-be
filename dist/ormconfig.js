"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'shamo-typescript',
    entities: [__dirname + '/entity/*.ts'],
    synchronize: true,
};
exports.default = config;
