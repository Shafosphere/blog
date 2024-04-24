import express from "express";
import session from 'express-session';
import cors from "cors";
import pg from "pg";

const app = express();
const port = 8080;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "",
  port: 5433,
});
db.connect();

app.use(express.json());
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;

        if(password === storedPassword){
          req.session.user = username;
          res.status(200).send('successful login');
        } else {
          res.status(401).send('Invalid username or password');
        }
      } else{
        res.status(404).send("User not found");
      }
    } catch (err) {
      res.status(500).send(err.message);
      console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
