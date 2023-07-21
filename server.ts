if (process.env.NODE_ENV !== "prodction") {
  require("dotenv").config();
}

const express = require("express");
import { Request, Response, NextFunction } from "express";
const app = express();
const expressLayouts = require("express-ejs-layouts");
const logger = require("./src/logger");
const methodOverride = require("method-override");
const routes = require("./src/routes");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const session = require("express-session");
const connectToDatabase = require("./src/database");
const port = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", __dirname + "/src/views");
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
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use("/", routes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).send({ error: err.message });
});

async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`);
  });
}
startServer();
