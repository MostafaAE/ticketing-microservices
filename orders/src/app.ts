import express from "express";
import "express-async-errors";

import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@mostatickets/common";
import { indexOrderRouter } from "./routes";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

app.use(currentUser);
app.use(indexOrderRouter);

// Handle unhandeled routes
app.all("*", (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
