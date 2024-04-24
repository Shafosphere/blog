import express from "express";
import { body, validationResult } from "express-validator";
import session from "express-session";
import cors from "cors";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";

const app = express();
const port = 8080;
const saltRounds = 10;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "",
  port: 5433,
});
db.connect();

app.use(express.json());
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHash = user.password;

      bcrypt.compare(password, storedHash, (err, result)=>{
        if(err) {
          console.log("Error comparing passwords: ", err);
        } else{
          if(result){
            req.session.user = username;
            res.status(200).send("successful login");
          } else {
            res.status(401).send("Invalid username or password");
          }
        }
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
});

app.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("confirmPass").custom((value, { req }) => value === req.body.password),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const checkResult = await db.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
      );
      if (checkResult.rows.length > 0) {
        if (checkResult.rows.username) {
          res.status(401).send("The username is already in use");
        } else {
          res.status(401).send("The email is already in use");
        }
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.log("Error hasing password:", err);
          } else {
            await db.query(
              "INSERT INTO users (username, email, password) VALUES ($1, $2 , $3)",
              [username, email, hash]
            );
            req.session.user = username;
            res.status(200).send("successful register");
          }
        });
      }
    } catch (err) {
      res.status(500).send(err.message);
      console.log(err);
    }
  }
);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
