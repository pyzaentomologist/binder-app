if (process.env.NODE_ENV !== "prodction") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const logger = require("./src/logger");
const port = process.env.PORT || 3001;
const methodOverride = require("method-override");
const routes = require("./src/routes");
const MongoStore = require("connect-mongo");
// const indexRouter = require("./src/routes/index");
// const authRouter = require("./src/views/routes/auth");
// const authVariables = require("./src/middleware/authVariables");
// const checkAuthenticated = require("./src/middleware/checkAuthenticated");
// const isValidRoute = require("./src/middleware/isValidRoute");
const flash = require("express-flash");
const session = require("express-session");
const connectToDatabase = require("./src/database");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_ENV,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use("/", routes);
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).send({ error: err.message });
});
// app.use(authVariables);
// app.use(checkAuthenticated);

// app.use("/", indexRouter);
// app.use("/auth", authRouter);

// app.use(isValidRoute);

async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`);
  });
}
startServer();
