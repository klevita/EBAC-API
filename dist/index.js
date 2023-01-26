"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const pool = new pg_1.default.Pool({
    user: 'kklevita92',
    host: 'ep-wispy-band-773803.eu-central-1.aws.neon.tech',
    database: 'neondb',
    password: '05zdWctCXuAf',
    port: 5432,
    ssl: true,
});
var jsonParser = body_parser_1.default.json();
app.use((0, cors_1.default)({
    origin: '*',
}));
app.get('/', (req, res) => {
    res.send('hi EBAC :)');
});
app.get('/task/getTasksByUserId/:id', (req, res) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM ebac WHERE user_id=${id}`, (error, results) => {
        if (error) {
            throw error;
        }
        res.send(JSON.stringify(results.rows));
    });
});
app.post("/task/alterTask", jsonParser, function (req, res) {
    var _a, _b, _c;
    if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.userId) || !((_b = req.body) === null || _b === void 0 ? void 0 : _b.title) || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.completed) === undefined)
        return res.sendStatus(400);
    const userId = req.body.userId;
    const completed = req.body.completed;
    let title;
    if (req.body.title.length > 256) {
        title = req.body.title.substring(0, 256);
    }
    else {
        title = req.body.title;
    }
    pool.query(`INSERT INTO ebac (user_id, title, completed) VALUES(${userId}, '${title}', ${completed}) RETURNING id`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(JSON.stringify(results.rows[0].id));
    });
});
app.delete("/task/deleteTaskById/:id", function (req, res) {
    const id = req.params.id;
    pool.query(`DELETE FROM ebac WHERE id=${id}`, (error) => {
        if (error) {
            throw error;
        }
        res.sendStatus(200);
    });
});
app.patch("/task/completeTaskById/:id", jsonParser, function (req, res) {
    var _a;
    if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.completed) === undefined)
        return res.sendStatus(400);
    const completed = req.body.completed;
    const id = req.params.id;
    pool.query(`UPDATE ebac SET completed = ${completed} WHERE id = ${id}`, (error) => {
        if (error) {
            throw error;
        }
        res.sendStatus(200);
    });
});
const port = 8087;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
