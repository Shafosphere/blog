import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });
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
import multer from "multer";

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
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Zapisz pliki w folderze 'uploads'
    cb(null, 'public/images');
  },
  filename: function(req, file, cb) {
    // Nazwij plik unikalną nazwą, aby uniknąć nadpisania
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

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

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.json({ success: true, message: "Wylogowano pomyślnie." });
  });
});

app.get("/data", isAuthenticated, async (req, res) => {
  try {
    const articleData = await db.query(`
      SELECT 
        a.id, a.title, a.description, a.content, a.creation_time, a.is_main,
        u.username,
        i.image_path,
        i.is_local
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN images i ON a.image_id = i.id
    `);

    
    const articles = articleData.rows.map((article) => {
      let imagePath = article.image_path;
      if (article.is_local) {
        imagePath = `http://localhost:8080/${imagePath}`;
      }
      return {
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        creationTime: article.creation_time,
        isMain: article.is_main,
        author: article.username,
        imagePath: imagePath || null,
      };
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        success: false,
        message: "Błąd serwera podczas pobierania danych.",
      });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ success: false, message: info.message });
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

app.post(
  "/article",
  isAuthenticated,
  upload.single("imageFile"),
  async (req, res) => {
    const { id, username } = req.user;
    const { title, description, content, imageLink } = req.body;

    let image_path;
    let is_local = false;
    let image_id = null;
    if (req.file) {
      image_path = req.file.path;
      is_local = true;
    } else if (imageLink) {
      image_path = imageLink;
    }

    if (image_path) {
      try {
        const result = await db.query(
          "INSERT INTO images (image_path, is_local) VALUES ($1, $2) RETURNING id",
          [image_path, is_local]
        );
        image_id = result.rows[0].id;
        console.log('added image')
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, message: "Błąd podczas dodawania obrazu." });
      }
    }

    try {
      const checkResult = await db.query(
        "SELECT id FROM users WHERE id = $1 AND username = $2",
        [id, username]
      );
      if (checkResult.rows.length > 0) {
        const insertArticle = await db.query(
          "INSERT INTO articles (author_id, title, description, content, image_id) VALUES ($1, $2 , $3, $4, $5) RETURNING id",
          [id, title, description, content, image_id]
        );
        console.log('added article')
        return res.json({ success: true, articleId: insertArticle.rows[0].id });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Autor nie znaleziony." });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Błąd serwera." });
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
            return cb(null, false, { message: "Error compare" });
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false, { message: "Invalid password" });
            }
          }
        });
      } else {
        return cb(null, false, { message: 'User not found' });
      }
    } catch (err) {
      return err;
    }
  })
);

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Nie jesteś zalogowany" });
  }

  jwt.verify(token, TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Nieprawidłowy token" });
    }
    req.user = decoded;
    next();
  });
}

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
