"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const pool = new pg_1.default.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'EBAC',
    password: 'admin',
    port: 5432,
});
app.get('/', (req, res) => {
    res.send('hi EBAC :)');
});
app.get('/getTasksByUserId/:id', (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM "test-task" WHERE "userId"=${id}`, (error, results) => {
        if (error) {
            throw error;
        }
        res.send(JSON.stringify(results.rows));
    });
});
const port = 8087;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
