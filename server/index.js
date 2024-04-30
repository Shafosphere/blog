import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
import express from "express";
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";
import session from "express-session";
import cors from "cors";
import pg from "pg";
import bcrypt, { hash } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const port = 8080;
const saltRounds = 10;
const DATABASE = process.env.REACT_APP_DATABASE;
const SESSION_KEY = process.env.REACT_APP_SESSION_KEY;
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;

app.use(
  session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: DATABASE,
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
  const token = req.cookies.token;
  if (!token) {
    return res.json({ authenticated: false });
  }
  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.json({ authenticated: false });
    }
    const userId = decoded.id;
    const userNick = decoded.username;
    const userEmail = decoded.email;
    db.query(
      "SELECT * FROM users WHERE id = $1 AND username = $2 AND email = $3",
      [userId, userNick, userEmail],
      (err, result) => {
        if (err || result.rows.length === 0) {
          return res.json({ authenticated: false });
        }
        return res.json({ authenticated: true, user: userNick });
      }
    );
  });
});

app.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.clearCookie('connect.sid');
    res.clearCookie('token');
    res.json({ success: true, message: 'Wylogowano pomyślnie.' });
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send("Bad Request");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const tokendata = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const secret = TOKEN_KEY;
      const token = jwt.sign(tokendata, secret, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });
      return res.json({ success: true, message: "Loggin success." });
    });
  })(req, res, next);
});

app.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 3 }),
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
            console.log("Error hashing password:", err);
            return res.status(500).send("Error during registration");
          } else {
            await db.query(
              "INSERT INTO users (username, email, password) VALUES ($1, $2 , $3)",
              [username, email, hash]
            );
            return res.json({ success: true, message: "Loggin success." });
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
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHash = user.password;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (err) {
            return cb("Error comparing passwords: ", err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
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
