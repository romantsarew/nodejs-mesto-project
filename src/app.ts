import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { login, createUser } from "./controllers/users";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import errorHandler from "./middlewares/error-handler";
import { NotFoundError } from "./errors/errors";

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/users", auth, userRouter);
app.use("/cards", auth, cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
