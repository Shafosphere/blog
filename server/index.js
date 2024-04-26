import express from "express";
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";
import session from "express-session";
import cors from "cors";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import jwt from 'jsonwebtoken';

const app = express();
const port = 8080;
const saltRounds = 10;

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie:{
      maxAge: 1000 * 60 * 60 * 24,
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Dodaj to przed twoimi trasami (routes)


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "",
  port: 5433,
});
db.connect();



app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));


app.get("/is-authenticated", (req, res) => {
  res.json({ authenticated: req.isAuthenticated() });
});

app.post("/login", (req, res, next) => {
  console.log("login");
  console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("11");
      return next(err);
    }
    if (!user) {
      console.log("22");
      return res.status(400).send('Bad Request');
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("33");
        return next(err);
      }
      console.log(user);
      const tokendata = { id: user.id, username: user.username, email: user.email};
      const secret = 'secret_key';
      const token = jwt.sign(tokendata, secret, { expiresIn: '1h' });
      console.log("44");
      return res.json({ success: true, message: "Loggin success.", token });
    });
  })(req, res, next);
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

passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log('Verifying user:', username);
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHash = user.password;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (err) {
            console.log("1");
            return cb("Error comparing passwords: ", err);
          } else {
            if (result) {
              console.log("2");
              return cb(null, user);
            } else {
              console.log("3");
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return err;
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
