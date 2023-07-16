if (process.env.NODE_ENV !== "prodction") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const logoutRouter = require("./routes/logout");
const postsRouter = require("./routes/posts");
const tokenRouter = require("./routes/token");
const methodOverride = require("method-override");
const authVariables = require("./middleware/authVariables");
const checkAuthenticated = require("./middleware/checkAuthenticated");
const isValidRoute = require("./middleware/isValidRoute");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(flash());
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
app.use(
  session({
    secret: process.env.SESSION_ENV,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(authVariables);
// app.use(checkAuthenticated);
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/posts", postsRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/register", registerRouter);
app.use("/token", tokenRouter);

app.use(isValidRoute);
app.listen(process.env.PORT || 3001);
