const express = require('express')
const pg = require('pg')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

dotenv.config();
const app = express();
const pool = new pg.Pool({
    user: 'kklevita92',
    host: 'ep-wispy-band-773803.eu-central-1.aws.neon.tech',
    database: 'neondb',
    password: '05zdWctCXuAf',
    port: 5432,
    ssl: true,
})
var jsonParser = bodyParser.json()

app.use(
    cors({
        origin: '*',
    })
)

app.get('/', (req, res) => {
    res.send('hi EBAC :)')
});

app.get('/task/getTasksByUserId/:id', (req, res) => {
    const id = req.params.id
    pool.query(`SELECT * FROM ebac WHERE user_id=${id}`, (error, results) => {
        if (error) {
            throw error
        }
        res.send(JSON.stringify(results.rows))
    })
});

app.post("/task/alterTask", jsonParser, function (req, res) {
    if (!req.body?.userId || !req.body?.title || req.body?.completed === undefined) return res.sendStatus(400);
    
    const userId = req.body.userId;
    const completed = req.body.completed
    let title;
    if(req.body.title.length>256){
        title = req.body.title.substring(0,256)
    }else{
        title = req.body.title
    }
    pool.query(`INSERT INTO ebac (user_id, title, completed) VALUES(${userId}, '${title}', ${completed}) RETURNING id`, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(JSON.stringify(results.rows[0].id))
    })
});

app.delete("/task/deleteTaskById/:id", function (req, res) {
    const id = req.params.id
    pool.query(`DELETE FROM ebac WHERE id=${id}`, (error) => {
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
    pool.query(`UPDATE ebac SET completed = ${completed} WHERE id = ${id}`, (error) => {
        if (error) {
            throw error
        }
        res.sendStatus(200)
    })
});

const port = 8087
app.listen(port, () => {
    console.log(`[server]: Server is running at ${port}`);
});