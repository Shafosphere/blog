import express from "express";
import session from 'express-session';
import cors from "cors";

const app = express();
const port = 8080;

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

const users = {
    'admin': 'admin'
};

app.use(cors(corsOptions));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
      req.session.user = username;
      res.status(200).send('successful login');
    } else {
      res.status(401).send('Invalid username or password');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
