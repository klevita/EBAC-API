import express, { Express, Request, Response } from 'express';
import pg, { Pool } from 'pg'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'

dotenv.config();
const app: Express = express();
const pool: Pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'EBAC',
    password: 'admin',
    port: 5432,
})
var jsonParser = bodyParser.json()

app.use(
    cors({
        origin: "http://localhost:8080",
    })
)

app.get('/', (req: Request, res: Response) => {
    res.send('hi EBAC :)')
});

app.get('/task/getTasksByUserId/:id', (req: Request, res: Response) => {
    const id = req.params.id
    pool.query(`SELECT * FROM "testTask" WHERE "userId"=${id}`, (error, results) => {
        if (error) {
            throw error
        }
        res.send(JSON.stringify(results.rows))
    })
});

app.post("/task/alterTask", jsonParser, function (req, res) {
    if (!req.body?.userId || !req.body?.title || req.body?.completed === undefined) return res.sendStatus(400);
    const userId = req.body.userId;
    const title = req.body.title;
    const completed = req.body.completed
    pool.query(`SELECT MAX(id)+1 FROM "testTask";`, (error, results) => {
        if (error) {
            throw error
        }
        const nextId = Object.values(results.rows[0])[0]
        pool.query(`INSERT INTO "testTask" (id, "userId",title,completed) VALUES(${nextId}, ${userId}, '${title}', ${completed}) RETURNING id`, (error, results) => {
            if (error) {
                throw error
            }
            res.send(results.rows[0].id)
        })
    })
});

app.delete("/task/deleteTaskById/:id", function (req, res) {
    const id = req.params.id
    pool.query(`DELETE FROM "testTask" WHERE id=${id}`, (error, results) => {
        if (error) {
            throw error
        }
        res.sendStatus(200)
    })
});

app.patch("/task/completeTaskById/:id", jsonParser, function (req, res) {
    if (req.body?.completed === undefined) return res.sendStatus(400);
    const completed = req.body.completed;
    const id = req.params.id
    pool.query(`UPDATE "testTask" SET completed = ${completed} WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error
        }
        res.sendStatus(200)
    })
});

const port = 8087
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});