import express, { Express, Request, Response } from 'express';
import pg,{Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config();
const app: Express = express();
const pool:Pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'EBAC',
  password: 'admin',
  port: 5432,
})

app.get('/', (req:Request, res:Response) => {
    res.send('hi EBAC :)')
});

app.get('/getTasksByUserId/:id', (req:Request, res:Response) => {
    const id = req.params.id
    pool.query(`SELECT * FROM "test-task" WHERE "userId"=${id}`, (error, results) => {
        if (error) {
          throw error
        }
        res.send(JSON.stringify(results.rows))
      })
});

const port = 8087
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});